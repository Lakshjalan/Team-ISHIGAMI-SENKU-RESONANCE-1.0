import random
import pandas as pd
from pathlib import Path

from src.feature_extraction import extract_features


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


# ---------------------------------------------------------
# LOAD DATABASES
# ---------------------------------------------------------

def load_databases():

    databases = {}

    for i in range(1, 4):

        path = DATA_DIR / f"database_{i}.csv"

        databases[f"database_{i}"] = pd.read_csv(
            path,
            keep_default_na=False
        )

    return databases


# ---------------------------------------------------------
# ENTITY ID
# ---------------------------------------------------------

def get_entity_id(row_index):
    return f"STU{row_index + 1:04d}"


# ---------------------------------------------------------
# POSITIVE PAIRS
# ---------------------------------------------------------

def create_positive_pairs(databases):

    pairs = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]
    db3 = databases["database_3"]

    count = min(len(db1), len(db2), len(db3))

    for i in range(count):

        entity_id = get_entity_id(i)

        records = [
            db1.iloc[i].to_dict(),
            db2.iloc[i].to_dict(),
            db3.iloc[i].to_dict()
        ]

        pairs.extend([
            {
                "record1": records[0],
                "record2": records[1],
                "label": 1,
                "entity_id": entity_id,
                "pair_type": "positive"
            },
            {
                "record1": records[0],
                "record2": records[2],
                "label": 1,
                "entity_id": entity_id,
                "pair_type": "positive"
            },
            {
                "record1": records[1],
                "record2": records[2],
                "label": 1,
                "entity_id": entity_id,
                "pair_type": "positive"
            }
        ])

    return pairs


# ---------------------------------------------------------
# DIFFERENT ENTITY
# ---------------------------------------------------------

def get_different_record(
    databases,
    source_db,
    source_index
):

    db_names = [
        name for name in databases
        if name != source_db
    ]

    target_db = random.choice(db_names)

    target_dataframe = databases[target_db]

    while True:

        target_index = random.randrange(
            len(target_dataframe)
        )

        if target_index != source_index:
            break

    return target_dataframe.iloc[target_index].to_dict()


# ---------------------------------------------------------
# EASY NEGATIVES
# ---------------------------------------------------------

def create_easy_negatives(
    databases,
    number_of_pairs
):

    pairs = []

    db_names = list(databases.keys())

    while len(pairs) < number_of_pairs:

        db1_name, db2_name = random.sample(
            db_names,
            2
        )

        db1 = databases[db1_name]
        db2 = databases[db2_name]

        i = random.randrange(len(db1))
        j = random.randrange(len(db2))

        if i == j:
            continue

        pairs.append({
            "record1": db1.iloc[i].to_dict(),
            "record2": db2.iloc[j].to_dict(),
            "label": 0,
            "entity_id": None,
            "pair_type": "negative_easy"
        })

    return pairs


# ---------------------------------------------------------
# SAME NAME NEGATIVES
# ---------------------------------------------------------

def create_same_name_negatives(
    databases,
    number_of_pairs
):

    candidates = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]
    db3 = databases["database_3"]

    database_pairs = [
        (db1, db2),
        (db1, db3),
        (db2, db3)
    ]

    for dataframe1, dataframe2 in database_pairs:

        for i in range(len(dataframe1)):

            record1 = dataframe1.iloc[i].to_dict()

            name1 = str(
                record1["name"]
            ).strip().lower()

            if not name1:
                continue

            for j in range(len(dataframe2)):

                if i == j:
                    continue

                record2 = dataframe2.iloc[j].to_dict()

                name2 = str(
                    record2["name"]
                ).strip().lower()

                if name1 == name2:

                    candidates.append({
                        "record1": record1,
                        "record2": record2,
                        "label": 0,
                        "entity_id": None,
                        "pair_type": "negative_same_name"
                    })

    random.shuffle(candidates)

    return candidates[:number_of_pairs]


# ---------------------------------------------------------
# SAME DOB NEGATIVES
# ---------------------------------------------------------

def create_same_dob_negatives(
    databases,
    number_of_pairs
):

    candidates = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]
    db3 = databases["database_3"]

    database_pairs = [
        (db1, db2),
        (db1, db3),
        (db2, db3)
    ]

    for dataframe1, dataframe2 in database_pairs:

        for i in range(len(dataframe1)):

            record1 = dataframe1.iloc[i].to_dict()

            dob1 = str(
                record1["DOB"]
            ).strip()

            if not dob1:
                continue

            for j in range(len(dataframe2)):

                if i == j:
                    continue

                record2 = dataframe2.iloc[j].to_dict()

                dob2 = str(
                    record2["DOB"]
                ).strip()

                if dob1 == dob2:

                    candidates.append({
                        "record1": record1,
                        "record2": record2,
                        "label": 0,
                        "entity_id": None,
                        "pair_type": "negative_same_dob"
                    })

    random.shuffle(candidates)

    return candidates[:number_of_pairs]


# ---------------------------------------------------------
# HARD NEGATIVES
# ---------------------------------------------------------
#
# Find DIFFERENT entities with multiple agreeing fields.
#
# We specifically want cases like:
#
# same name + same DOB
# same name + same branch
# same DOB + same branch
# same name + same DOB + same branch
# etc.
# ---------------------------------------------------------

def create_single_field_negatives(
    databases,
    target_count=40
):
    negatives = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]

    # Use deliberately different records.
    for i in range(len(db1)):

        for j in range(len(db2)):

            if i == j:
                continue

            original1 = db1.iloc[i].to_dict()
            original2 = db2.iloc[j].to_dict()

            # ----------------------------------------------
            # PHONE ONLY
            # ----------------------------------------------

            record1 = original1.copy()
            record2 = original2.copy()

            record2["phone"] = record1["phone"]

            # Force every other identifying field to differ.
            record2["email"] = "different_email@example.com"
            record2["name"] = "Completely Different Person"
            record2["DOB"] = "1999-01-01"
            record2["branch"] = "DIFFERENT_BRANCH"
            record2["course"] = "DIFFERENT_COURSE"

            negatives.append({
                "record1": record1,
                "record2": record2,
                "label": 0,
                "entity_id": None,
                "pair_type": "negative_single_phone"
            })

            # ----------------------------------------------
            # EMAIL ONLY
            # ----------------------------------------------

            record1 = original1.copy()
            record2 = original2.copy()

            record2["email"] = record1["email"]

            record2["phone"] = "9000012345"
            record2["name"] = "Completely Different Person"
            record2["DOB"] = "1999-01-01"
            record2["branch"] = "DIFFERENT_BRANCH"
            record2["course"] = "DIFFERENT_COURSE"

            negatives.append({
                "record1": record1,
                "record2": record2,
                "label": 0,
                "entity_id": None,
                "pair_type": "negative_single_email"
            })

            # ----------------------------------------------
            # DOB ONLY
            # ----------------------------------------------

            record1 = original1.copy()
            record2 = original2.copy()

            record2["DOB"] = record1["DOB"]

            record2["email"] = "different_email@example.com"
            record2["phone"] = "9000012345"
            record2["name"] = "Completely Different Person"
            record2["branch"] = "DIFFERENT_BRANCH"
            record2["course"] = "DIFFERENT_COURSE"

            negatives.append({
                "record1": record1,
                "record2": record2,
                "label": 0,
                "entity_id": None,
                "pair_type": "negative_single_dob"
            })

            if len(negatives) >= target_count:
                return negatives

    return negatives



def create_hard_negatives(
    databases,
    number_of_pairs
):

    candidates = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]
    db3 = databases["database_3"]

    database_pairs = [
        (db1, db2),
        (db1, db3),
        (db2, db3)
    ]

    for dataframe1, dataframe2 in database_pairs:

        for i in range(len(dataframe1)):

            record1 = dataframe1.iloc[i].to_dict()

            for j in range(len(dataframe2)):

                if i == j:
                    continue

                record2 = dataframe2.iloc[j].to_dict()

                features = extract_features(
                    record1,
                    record2
                )

                # -------------------------------------------------
                # Count meaningful agreements
                # -------------------------------------------------

                name_match = (
                    features["name_similarity"] >= 0.85
                )

                email_match = (
                    features["email_similarity"] == 1.0
                )

                phone_match = (
                    features["phone_similarity"] == 1.0
                )

                dob_match = (
                    features["dob_similarity"] == 1.0
                )

                branch_match = (
                    features["branch_similarity"] >= 0.85
                )

                course_match = (
                    features["course_similarity"] >= 0.85
                )

                strong_matches = sum([
                    name_match,
                    email_match,
                    phone_match,
                    dob_match
                ])

                academic_matches = sum([
                    branch_match,
                    course_match
                ])

                # -------------------------------------------------
                # HARD CASE
                #
                # Different entities but several fields agree.
                # -------------------------------------------------

                if (
                    strong_matches >= 2
                    or
                    (
                        strong_matches >= 1
                        and academic_matches == 2
                    )
                ):

                    candidates.append({
                        "record1": record1,
                        "record2": record2,
                        "label": 0,
                        "entity_id": None,
                        "pair_type": "negative_hard"
                    })

    # Remove duplicates by feature pattern + records
    unique = {}

    for pair in candidates:

        key = (
            pair["record1"]["name"],
            pair["record1"]["email"],
            pair["record1"]["phone"],
            pair["record1"]["DOB"],
            pair["record2"]["name"],
            pair["record2"]["email"],
            pair["record2"]["phone"],
            pair["record2"]["DOB"]
        )

        unique[key] = pair

    candidates = list(unique.values())

    random.shuffle(candidates)

    return candidates[:number_of_pairs]


# ---------------------------------------------------------
# FEATURE EXTRACTION
# ---------------------------------------------------------

def convert_to_training_dataframe(pairs):

    rows = []

    for pair in pairs:

        features = extract_features(
            pair["record1"],
            pair["record2"]
        )

        rows.append({
            **features,
            "label": pair["label"],
            "entity_id": pair["entity_id"],
            "pair_type": pair["pair_type"]
        })

    return pd.DataFrame(rows)


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

if __name__ == "__main__":

    random.seed(42)

    print("=" * 60)
    print("RESONANCE ML V0.2 TRAINING DATA GENERATION")
    print("=" * 60)

    print("\nLoading databases...")

    databases = load_databases()

    # -----------------------------------------------------
    # POSITIVE
    # -----------------------------------------------------

    print("\nGenerating positive pairs...")

    positive_pairs = create_positive_pairs(
        databases
    )

    print(
        f"Positive pairs: "
        f"{len(positive_pairs)}"
    )

    # -----------------------------------------------------
    # NEGATIVE TARGET
    # -----------------------------------------------------

    target_negative_count = len(
        positive_pairs
    )

    # -----------------------------------------------------
    # EASY
    # -----------------------------------------------------

    easy_count = target_negative_count // 4

    print("\nGenerating easy negatives...")

    easy_negatives = create_easy_negatives(
        databases,
        easy_count
    )

    print(
        f"Easy negatives: "
        f"{len(easy_negatives)}"
    )

    # -----------------------------------------------------
    # SAME NAME
    # -----------------------------------------------------

    same_name_count = target_negative_count // 8

    print("\nGenerating same-name negatives...")

    same_name_negatives = (
        create_same_name_negatives(
            databases,
            same_name_count
        )
    )

    print(
        f"Same-name negatives: "
        f"{len(same_name_negatives)}"
    )

    # -----------------------------------------------------
    # SAME DOB
    # -----------------------------------------------------

    same_dob_count = target_negative_count // 8

    print("\nGenerating same-DOB negatives...")

    same_dob_negatives = (
        create_same_dob_negatives(
            databases,
            same_dob_count
        )
    )

    print(
        f"Same-DOB negatives: "
        f"{len(same_dob_negatives)}"
    )

    # -----------------------------------------------------
    # HARD NEGATIVES
    # -----------------------------------------------------

    hard_count = (
        target_negative_count
        - len(easy_negatives)
        - len(same_name_negatives)
        - len(same_dob_negatives)
    )

    print("\nGenerating hard negatives...")

    hard_negatives = create_hard_negatives(
        databases,
        hard_count
    )
    print(
        f"Hard negatives"
        f"{len(hard_negatives)}"
    )
    print("\nGenerating single-field negatives...")
    single_field_negatives = create_single_field_negatives(
    databases,
    target_count=40
    )
    print(
    f"Single-field negatives: "
    f"{len(single_field_negatives)}"
    ) 
    
    print(
        f"Hard negatives: "
        f"{len(hard_negatives)}"
    )

    # -----------------------------------------------------
    # COMBINE
    # -----------------------------------------------------

    all_pairs = (
        positive_pairs
        + easy_negatives
        + same_name_negatives
        + same_dob_negatives
        + hard_negatives
        +single_field_negatives
    )

    random.shuffle(all_pairs)

    # -----------------------------------------------------
    # FEATURES
    # -----------------------------------------------------

    print("\nExtracting features...")

    training_data = (
        convert_to_training_dataframe(
            all_pairs
        )
    )

    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    output_path = (
        DATA_DIR / "training_pairs.csv"
    )

    training_data.to_csv(
        output_path,
        index=False
    )

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    print("\n")
    print("=" * 60)
    print("V0.2 TRAINING DATA GENERATED")
    print("=" * 60)

    print(
        f"Total pairs : "
        f"{len(training_data)}"
    )

    print(
        f"Positive    : "
        f"{sum(training_data['label'] == 1)}"
    )

    print(
        f"Negative    : "
        f"{sum(training_data['label'] == 0)}"
    )

    print("\nPair types:")

    print(
        training_data[
            "pair_type"
        ].value_counts()
    )

    print(
        f"\nSaved to: "
        f"{output_path}"
    )