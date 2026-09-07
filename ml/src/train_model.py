import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report
)


# ---------------------------------------------------------
# PATHS
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "training_pairs.csv"

MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "matcher.pkl"


# ---------------------------------------------------------
# LOAD DATA
# ---------------------------------------------------------

print("Loading training data...")

data = pd.read_csv(DATA_PATH)

print(f"Total training examples: {len(data)}")


# ---------------------------------------------------------
# FEATURES AND LABEL
# ---------------------------------------------------------

feature_columns = [
    "name_similarity",
    "email_similarity",
    "phone_similarity",
    "branch_similarity",
    "course_similarity",
    "dob_similarity"
]

X = data[feature_columns]

y = data["label"]


# ---------------------------------------------------------
# TRAIN / TEST SPLIT
# ---------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print(f"Training examples: {len(X_train)}")
print(f"Testing examples : {len(X_test)}")


# ---------------------------------------------------------
# TRAIN MODEL
# ---------------------------------------------------------

print("\nTraining Logistic Regression model...")

model = LogisticRegression(
    max_iter=1000
)

model.fit(
    X_train,
    y_train
)


print("Training complete.")


# ---------------------------------------------------------
# PREDICTIONS
# ---------------------------------------------------------

y_pred = model.predict(X_test)

y_probability = model.predict_proba(X_test)[:, 1]


# ---------------------------------------------------------
# EVALUATION
# ---------------------------------------------------------

accuracy = accuracy_score(
    y_test,
    y_pred
)

precision = precision_score(
    y_test,
    y_pred
)

recall = recall_score(
    y_test,
    y_pred
)

f1 = f1_score(
    y_test,
    y_pred
)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)


print("\n")
print("=" * 55)
print("MODEL EVALUATION")
print("=" * 55)

print(f"Accuracy  : {accuracy:.4f}")
print(f"Precision : {precision:.4f}")
print(f"Recall    : {recall:.4f}")
print(f"F1 Score  : {f1:.4f}")
print(f"ROC-AUC   : {roc_auc:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)


# ---------------------------------------------------------
# MODEL COEFFICIENTS
# ---------------------------------------------------------

print("\nFeature coefficients:")

for feature, coefficient in zip(
    feature_columns,
    model.coef_[0]
):

    print(
        f"{feature:<22}: "
        f"{coefficient:.4f}"
    )


# ---------------------------------------------------------
# SAVE MODEL
# ---------------------------------------------------------

MODEL_DIR.mkdir(
    exist_ok=True
)

joblib.dump(
    {
        "model": model,
        "features": feature_columns
    },
    MODEL_PATH
)


print("\n")
print("=" * 55)
print("MODEL SAVED")
print("=" * 55)

print(f"Saved to: {MODEL_PATH}")
