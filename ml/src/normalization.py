import re


def normalize_text(value):
    """
    General text normalization.

    Example:
    '  Rahul  Sharma  ' -> 'rahul sharma'
    """

    if value is None:
        return ""

    value = str(value).strip().lower()

    # Replace multiple spaces with one space
    value = re.sub(r"\s+", " ", value)

    return value


def normalize_email(value):
    """
    Normalize email addresses.
    """

    return normalize_text(value)


def normalize_phone(value):
    """
    Keep only digits in a phone number.
    """

    if value is None:
        return ""

    return re.sub(r"\D", "", str(value))


def normalize_branch(value):
    """
    Convert common branch variations to a standard form.
    """

    value = normalize_text(value)

    branch_map = {
        "cse": "cse",
        "computer science": "cse",
        "computer science and engineering": "cse",
        "comp science": "cse",
        "comp. science": "cse",

        "ece": "ece",
        "electronics": "ece",
        "electronics and communication": "ece",
        "electronics and communication engineering": "ece",

        "it": "it",
        "information technology": "it",

        "eee": "eee",
        "electrical": "eee",
        "electrical and electronics": "eee",

        "mech": "mech",
        "mechanical": "mech",
        "mechanical engineering": "mech",
    }

    return branch_map.get(value, value)


def normalize_course(value):
    """
    Convert common course variations to a standard form.
    """

    value = normalize_text(value)

    course_map = {
        "b.tech": "btech",
        "btech": "btech",
        "bachelor of technology": "btech",
    }

    return course_map.get(value, value)


def normalize_record(record):
    """
    Normalize all fields of a student record.
    """

    return {
        "reg_no": normalize_text(record["reg_no"]),
        "name": normalize_text(record["name"]),
        "email": normalize_email(record["email"]),
        "phone": normalize_phone(record["phone"]),
        "branch": normalize_branch(record["branch"]),
        "course": normalize_course(record["course"]),
        "DOB": normalize_text(record["DOB"]),
    }