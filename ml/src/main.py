import joblib
from pathlib import Path

from src.feature_extraction import extract_features


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "matcher.pkl"


# --------------------------------------------------
# Load trained model
# --------------------------------------------------

model_data = joblib.load(MODEL_PATH)

model = model_data["model"]
feature_columns = model_data["features"]


# --------------------------------------------------
# Prediction function
# --------------------------------------------------

def predict_match(record1, record2):

    features = extract_features(record1, record2)

    feature_values = [
        features[column]
        for column in feature_columns
    ]

    probabilities = model.predict_proba(
        [feature_values]
    )[0]

    different_probability = probabilities[0]
    same_probability = probabilities[1]

    prediction = model.predict(
        [feature_values]
    )[0]

    classification = (
        "MATCH"
        if prediction == 1
        else "NO MATCH"
    )

    return {
        "features": features,
        "same_probability": same_probability,
        "different_probability": different_probability,
        "classification": classification
    }


# --------------------------------------------------
# Test records
# --------------------------------------------------

record_a = {
    "reg_no": "25BCE1042",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "CSE",
    "course": "B.Tech",
    "DOB": "2005-03-14"
}


# --------------------------------------------------
# Test runner
# --------------------------------------------------

def run_test(test_number, description, record1, record2):

    result = predict_match(record1, record2)

    print("\n" + "=" * 60)
    print(f"TEST {test_number}: {description}")
    print("=" * 60)

    print("\nFeatures:")

    for feature, value in result["features"].items():
        print(f"{feature:<22}: {value:.2f}")

    print("\nModel prediction:")

    print(
        f"SAME       : "
        f"{result['same_probability'] * 100:.2f}%"
    )

    print(
        f"DIFFERENT  : "
        f"{result['different_probability'] * 100:.2f}%"
    )

    print(
        f"CLASSIFICATION : "
        f"{result['classification']}"
    )


# --------------------------------------------------
# Run tests
# --------------------------------------------------

if __name__ == "__main__":

    # TEST 1
    # Everything matches
    record_b = record_a.copy()

    run_test(
        1,
        "Perfect match",
        record_a,
        record_b
    )


    # TEST 2
    # Name variation
    record_b = record_a.copy()
    record_b["name"] = "Rahul K Sharma"

    run_test(
        2,
        "Name variation",
        record_a,
        record_b
    )


    # TEST 3
    # Same name only
    record_b = {
        "reg_no": "25BEC2088",
        "name": "Rahul Sharma",
        "email": "different@example.com",
        "phone": "9123456780",
        "branch": "ECE",
        "course": "B.Tech",
        "DOB": "2004-07-21"
    }

    run_test(
        3,
        "Same name only",
        record_a,
        record_b
    )


    # TEST 4
    # Strong phone evidence
    record_b = {
        "reg_no": "25BCE2099",
        "name": "Rohan Verma",
        "email": "rohan@example.com",
        "phone": "9876543210",
        "branch": "CSE",
        "course": "B.Tech",
        "DOB": "2005-03-14"
    }

    run_test(
        4,
        "Different name but strong identity evidence",
        record_a,
        record_b
    )


    # TEST 5
    # Everything substantially different
    record_b = {
        "reg_no": "24BEC4567",
        "name": "Ananya Reddy",
        "email": "ananya@example.com",
        "phone": "9000012345",
        "branch": "ECE",
        "course": "B.Tech",
        "DOB": "2003-11-02"
    }

    run_test(
        5,
        "Everything different",
        record_a,
        record_b
    )


    # TEST 6
    # Only phone matches
    record_b = {
        "reg_no": "24BAI1111",
        "name": "Completely Different",
        "email": "other@example.com",
        "phone": "9876543210",
        "branch": "ECE",
        "course": "BSc",
        "DOB": "2001-01-01"
    }

    run_test(
        6,
        "Only phone matches",
        record_a,
        record_b
    )


    # TEST 7
    # Everything except phone matches
    record_b = record_a.copy()
    record_b["phone"] = "9000099999"

    run_test(
        7,
        "Everything except phone matches",
        record_a,
        record_b
    )


    # TEST 8
    # Email and phone conflict
    record_b = record_a.copy()
    record_b["email"] = "another@example.com"
    record_b["phone"] = "9000099999"

    run_test(
        8,
        "Email and phone conflict",
        record_a,
        record_b
    )


    # TEST 9
    # Phone missing
    record_b = record_a.copy()
    record_b["phone"] = ""

    run_test(
        9,
        "Phone missing",
        record_a,
        record_b
    )
    