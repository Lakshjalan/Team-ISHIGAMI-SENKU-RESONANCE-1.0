import joblib

from src.feature_extraction import extract_features


MODEL_PATH = "models/matcher.pkl"


# ---------------------------------------------------------
# LOAD TRAINED MODEL
# ---------------------------------------------------------

saved = joblib.load(MODEL_PATH)

model = saved["model"]
feature_columns = saved["features"]


# ---------------------------------------------------------
# TEST RECORDS
# ---------------------------------------------------------

record1 = {
    "name": "Rahul Sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "CSE",
    "course": "B.Tech",
    "DOB": "2005-03-14"
}


record2 = {
    "name": "R Sharma",
    "email": "r.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "CSE",
    "course": "B.Tech",
    "DOB": "2005-03-14"
}


# ---------------------------------------------------------
# FEATURE EXTRACTION
# ---------------------------------------------------------

features = extract_features(
    record1,
    record2
)


import pandas as pd

X = pd.DataFrame(
    [[features[feature] for feature in feature_columns]],
    columns=feature_columns
)


# ---------------------------------------------------------
# PREDICTION
# ---------------------------------------------------------

probabilities = model.predict_proba(X)[0]

probability_different = probabilities[0]
probability_same = probabilities[1]


# ---------------------------------------------------------
# OUTPUT
# ---------------------------------------------------------

print("\n")
print("=" * 55)
print("RESONANCE ENTITY MATCH PREDICTION")
print("=" * 55)

print("\nFeatures:")

for feature, value in features.items():
    print(
        f"{feature:<22}: {value:.2f}"
    )

print("\nPrediction:")
print("-" * 55)

print(
    f"Probability of DIFFERENT entity : "
    f"{probability_different:.4f}"
)

print(
    f"Probability of SAME entity      : "
    f"{probability_same:.4f}"
)

if probability_same >= 0.85:

    print("\nDecision: MATCH")

elif probability_same >= 0.60:

    print("\nDecision: REVIEW")

else:

    print("\nDecision: NO MATCH")