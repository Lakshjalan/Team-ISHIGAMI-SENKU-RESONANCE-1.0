from rapidfuzz.fuzz import ratio
from src.normalization import normalize_record

def text_similarity(value1, value2):
    """
    Calculate similarity between two text values.
    Returns a value between 0 and 1.
    """

    if value1 is None or value2 is None:
        return 0.0

    value1 = str(value1).strip().lower()
    value2 = str(value2).strip().lower()

    if not value1 or not value2:
        return 0.0

    return ratio(value1, value2) / 100


def exact_similarity(value1, value2):
    """
    Check whether two values are exactly equal.
    Returns 1.0 for a match and 0.0 otherwise.
    """

    if value1 is None or value2 is None:
        return 0.0

    value1 = str(value1).strip().lower()
    value2 = str(value2).strip().lower()

    return 1.0 if value1 == value2 else 0.0


def extract_features(record1, record2):
    """
    Compare two student records and return their similarity features.
    """

    features = {
        "name_similarity": text_similarity(
            record1["name"],
            record2["name"]
        ),

        "email_similarity": exact_similarity(
            record1["email"],
            record2["email"]
        ),

        "phone_similarity": exact_similarity(
            record1["phone"],
            record2["phone"]
        ),

        "branch_similarity": text_similarity(
            record1["branch"],
            record2["branch"]
        ),

        "course_similarity": text_similarity(
            record1["course"],
            record2["course"]
        ),

        "dob_similarity": exact_similarity(
            record1["DOB"],
            record2["DOB"]
        )
    }

    return features