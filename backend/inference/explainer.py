import logging
from typing import List
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

def _unwrap_estimator(model):
    """
    Try to unwrap common wrappers so we can read coefficients/importances.
    - Pipeline -> use last step
    - CalibratedClassifierCV -> use base_estimator of first calibrated classifier
    """
    est = model
    # Pipeline
    if hasattr(est, "named_steps"):
        try:
            est = list(est.named_steps.values())[-1]
        except Exception:
            pass
    # CalibratedClassifierCV
    if hasattr(est, "calibrated_classifiers_") and est.calibrated_classifiers_:
        try:
            est = est.calibrated_classifiers_[0].base_estimator
        except Exception:
            pass
    return est

def compute_contributions(model, X: pd.DataFrame, feature_names: List[str], use_shap: bool) -> List[dict]:
    """
    Best-effort feature contribution computation.
    Never raise; return [] on failure.
    Strategies (in order):
    1) SHAP if requested and available
    2) Linear models: coef_ * value
    3) Tree models: feature_importances_ * value
    4) Fallback: all zeros
    """
    try:
        if use_shap:
            try:
                import shap  # optional
                # Generic explainer; works for many sklearn pipelines
                explainer = shap.Explainer(model, X, feature_names=feature_names)
                sv = explainer(X)
                vals = sv.values
                if hasattr(vals, "shape") and len(vals.shape) == 3:
                    # some explainers return (n, m, k); take class-1 column
                    vals = vals[:, :, 1]
                vals = np.array(vals)[0].tolist()
            except Exception as e:
                logger.warning(f"SHAP unavailable/failing, falling back. Reason: {e}")
                vals = None
        else:
            vals = None

        if vals is None:
            est = _unwrap_estimator(model)
            row = X.iloc[0].values

            if hasattr(est, "coef_"):
                vals = (row * est.coef_[0]).tolist()
            elif hasattr(est, "feature_importances_"):
                vals = (row * est.feature_importances_).tolist()
            else:
                vals = [0.0] * len(feature_names)

        contribs = [{"feature": n, "contribution": float(v)} for n, v in zip(feature_names, vals)]
        contribs.sort(key=lambda d: abs(d["contribution"]), reverse=True)
        return contribs[:5]
    except Exception as e:
        logger.warning(f"compute_contributions failed; returning empty list. Reason: {e}")
        return []
