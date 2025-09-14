# train_model.py
import json, pickle, pathlib, warnings
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, classification_report, confusion_matrix

warnings.filterwarnings("ignore", category=UserWarning)

CSV_PATH = "data.csv"         # Kaggle WDBC file you downloaded
TARGET_COL = "diagnosis"      # 'M' or 'B'
DROP_COLS = ["id", "Unnamed: 32"]  # harmless if missing

# Load & clean
df = pd.read_csv(CSV_PATH)
for c in DROP_COLS:
    if c in df.columns:
        df = df.drop(columns=[c])

# Encode labels: M=1 (malignant), B=0 (benign)
df[TARGET_COL] = (df[TARGET_COL].astype(str).str.upper() == "M").astype(int)

# Features/target  — compact hybrid: 10 means + 4 worst + 2 se = 16 features
HYBRID_16 = [
    # means (10)
    "radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean",
    "compactness_mean", "concavity_mean", "concave points_mean", "symmetry_mean", "fractal_dimension_mean",
    # worst (4)
    "radius_worst", "perimeter_worst", "area_worst", "concavity_worst",
    # se (2)
    "radius_se", "concavity_se",
]

feature_cols = [c for c in HYBRID_16 if c in df.columns]
missing = [c for c in HYBRID_16 if c not in df.columns]
if missing:
    print("Warning: missing columns in CSV:", missing)

X = df[feature_cols].copy()
y = df[TARGET_COL].values

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Pipelines
pre = ColumnTransformer([("num", StandardScaler(), feature_cols)], remainder="drop")

logreg = Pipeline([
    ("pre", pre),
    ("clf", LogisticRegression(max_iter=500, class_weight="balanced", random_state=42)),
])

gboost = Pipeline([
    ("pre", pre),
    ("clf", GradientBoostingClassifier(random_state=42)),
])

# Pick better by CV AUC
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
logreg_auc = cross_val_score(logreg, X_train, y_train, cv=cv, scoring="roc_auc").mean()
gboost_auc = cross_val_score(gboost, X_train, y_train, cv=cv, scoring="roc_auc").mean()
print(f"CV AUC - LogReg: {logreg_auc:.4f} | GBoost: {gboost_auc:.4f}")

best = logreg if logreg_auc >= gboost_auc else gboost
best.fit(X_train, y_train)

# Calibrate probabilities
calib = CalibratedClassifierCV(best, method="sigmoid", cv=5)
calib.fit(X_train, y_train)

# Test metrics
proba = calib.predict_proba(X_test)[:, 1]
pred = (proba >= 0.5).astype(int)
print("Test ROC AUC:", roc_auc_score(y_test, proba))
print(classification_report(y_test, pred, target_names=["benign","malignant"]))
print("Confusion matrix:\n", confusion_matrix(y_test, pred))

# Save artifacts
out = pathlib.Path("model_out"); out.mkdir(exist_ok=True)
with open(out / "model_pipeline.pkl", "wb") as f:
    pickle.dump({"pipeline": calib, "feature_names": feature_cols,
                 "label_map": {"0":"benign","1":"malignant"}}, f)
(out / "version.txt").write_text("wdbc-calibrated-1.0", encoding="utf-8")

# Generate frontend schema from data stats
desc = X.describe(percentiles=[0.01, 0.5, 0.99]).T
schema = {"features": []}
for col in feature_cols:
    stats = desc.loc[col]
    step = float(np.round((stats["99%"] - stats["1%"]) / 200, 4)) if "99%" in desc.columns else 0.1
    schema["features"].append({
        "name": col,
        "label": col.replace("_"," ").title(),
        "type": "number",
        "placeholder": f"e.g., {stats['50%']:.2f}" if "50%" in desc.columns else None,
        "min": float(max(0.0, stats["min"] - abs(float(stats["min"])) * 0.1)) if "min" in desc.columns else 0.0,
        "max": float(stats["max"] * 1.05) if "max" in desc.columns else None,
        "step": step if step > 0 else 0.1,
        "required": True
    })
with open(out / "schema.json", "w") as f:
    json.dump(schema, f, indent=2)

print("\nSaved:")
print(" -", out / "model_pipeline.pkl")
print(" -", out / "version.txt")
print(" -", out / "schema.json")