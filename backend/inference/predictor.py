"""
Model prediction module with dummy mode fallback.
"""
import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline

from .explainer import compute_contributions

logger = logging.getLogger(__name__)

# Global model cache
_model_cache: Optional[Pipeline] = None
_schema_cache: Optional[Dict] = None


def load_model() -> Optional[Pipeline]:
    """
    Load the trained model pipeline (memoized singleton).
    Returns None if model files are not available.
    """
    global _model_cache

    if _model_cache is not None:
        return _model_cache

    model_path = Path(__file__).parent / "model" / "model_pipeline.pkl"

    if not model_path.exists():
        logger.info(f"Model file not found at {model_path}. Running in dummy mode.")
        return None

    try:
        import pickle
        with open(model_path, 'rb') as f:
            obj = pickle.load(f)

        if isinstance(obj, dict):
            pipeline = obj.get("pipeline")
            if pipeline is None:
                raise RuntimeError("model_pipeline.pkl did not contain 'pipeline'")
            _model_cache = pipeline
        else:
            _model_cache = obj

        logger.info("Model loaded successfully")
        return _model_cache

    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return None


def get_schema() -> Dict:
    """
    Load the feature schema from JSON file.
    Returns a default schema if file is not found.
    """
    global _schema_cache
    
    if _schema_cache is not None:
        return _schema_cache
    
    schema_path = Path(__file__).parent / "schema.json"
    
    try:
        with open(schema_path, 'r') as f:
            _schema_cache = json.load(f)
        logger.info("Schema loaded successfully")
        return _schema_cache
    except Exception as e:
        logger.warning(f"Failed to load schema from {schema_path}: {e}")
        # Return minimal default schema
        _schema_cache = {
            "features": [
                {
                    "name": "radius_mean",
                    "label": "Radius (mean)",
                    "type": "number",
                    "placeholder": "e.g., 14.1",
                    "min": 0,
                    "max": 50,
                    "step": 0.1,
                    "required": True
                }
            ]
        }
        return _schema_cache


def get_version() -> str:
    """
    Get the model version from version.txt file.
    Returns 'dummy-1.0' if file is not found.
    """
    version_path = Path(__file__).parent / "model" / "version.txt"
    
    try:
        with open(version_path, 'r') as f:
            version = f.read().strip()
        return version
    except Exception as e:
        logger.warning(f"Failed to load version from {version_path}: {e}")
        return "dummy-1.0"


def predict_dummy(input_dict: Dict[str, float]) -> Tuple[str, float, List[Dict[str, float]]]:
    """
    Generate deterministic dummy predictions for testing.
    
    Args:
        input_dict: Dictionary of feature names to values
        
    Returns:
        Tuple of (prediction_label, probability_malignant, top_contributions)
    """
    # Create deterministic pseudo-prediction
    feature_sum = sum(input_dict.values())
    # Use sigmoid-like function with clipping
    raw_prob = 1 / (1 + np.exp(-feature_sum * 0.01))
    probability_malignant = float(np.clip(raw_prob, 0.05, 0.95))
    
    prediction_label = "malignant" if probability_malignant >= 0.5 else "benign"
    
    # Generate deterministic contributions
    contributions = []
    for i, (feature, value) in enumerate(input_dict.items()):
        # Create some variation based on feature value and position
        contribution = value * (0.1 + 0.05 * i) * (1 if i % 2 == 0 else -1)
        contributions.append({
            "feature": feature,
            "contribution": float(contribution)
        })
    
    # Sort by absolute contribution
    contributions.sort(key=lambda x: abs(x['contribution']), reverse=True)
    
    return prediction_label, float(probability_malignant), contributions[:5]


def predict(input_dict: Dict[str, float]) -> Tuple[str, float, List[Dict[str, float]], str]:
    """
    Make a prediction using the loaded model or dummy mode.
    Returns: (prediction_label, probability_malignant, top_contributions, model_version)
    """
    dummy_mode = os.getenv('DUMMY_MODE', 'True').lower() == 'true'
    model = load_model()

    # If dummy OR model couldn't load, use dummy entirely
    if dummy_mode or model is None:
        logger.info("Using dummy mode for prediction")
        label, prob, contributions = predict_dummy(input_dict)
        return label, prob, contributions, "dummy-1.0"

    # ---- (A) PREDICTION (do not fall back unless this part fails) ----
    try:
        schema = get_schema()
        feature_names = [f["name"] for f in schema["features"]]

        missing_features = set(feature_names) - set(input_dict.keys())
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")

        # Build 2D row in schema order
        X = pd.DataFrame(
            [{name: float(input_dict[name]) for name in feature_names}],
            columns=feature_names,
        )


        proba = model.predict_proba(X)[0, 1]   # calibrated pipeline supports this
        probability_malignant = float(proba)
        threshold = float(os.getenv("PREDICTION_THRESHOLD", "0.50"))
        prediction_label = "malignant" if probability_malignant >= threshold else "benign"

    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        # Only if prediction itself fails, fall back to dummy
        label, prob, contributions = predict_dummy(input_dict)
        return label, prob, contributions, "error-fallback-1.0"

    # ---- (B) CONTRIBUTIONS (best-effort; never crash the whole endpoint) ----
    try:
        use_shap = os.getenv('EXPLAIN_WITH_SHAP', 'False').lower() == 'true'
        contributions = compute_contributions(model, X, feature_names, use_shap)
    except Exception as e:
        logger.warning(f"Contribution computation failed; returning empty contributions. Reason: {e}")
        contributions = []  # safe default

    model_version = get_version()
    logger.info(f"Prediction made: {prediction_label} (prob={probability_malignant:.3f})")
    return prediction_label, probability_malignant, contributions, model_version