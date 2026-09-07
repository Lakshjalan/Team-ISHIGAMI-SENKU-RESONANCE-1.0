from src.feature_extraction import extract_features


FEATURE_WEIGHTS = {
    "phone_similarity": 0.25,
    "email_similarity": 0.25,
    "name_similarity": 0.20,
    "dob_similarity": 0.15,
    "branch_similarity": 0.10,
    "course_similarity": 0.05
}


def calculate_match_score(features):
    """
    Calculate the overall match score from individual features.
    """

    score = 0.0

    for feature, weight in FEATURE_WEIGHTS.items():
        score += features[feature] * weight

    return score


def classify_match(score):
    """
    Convert a numerical score into a match category.
    """

    if score >= 0.85:
        return "MATCH"

    elif score >= 0.60:
        return "REVIEW"

    else:
        return "NO MATCH"


def compare_records(record1, record2):
    """
    Compare two records and return their features,
    score and classification.
    """

    features = extract_features(record1, record2)

    score = calculate_match_score(features)

    classification = classify_match(score)

    return {
        "features": features,
        "score": score,
        "classification": classification
    }