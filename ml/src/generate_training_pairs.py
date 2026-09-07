import random
import pandas as pd
from pathlib import Path

from src.feature_extraction import extract_features


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_databases():

    databases = {}

    for i in range(1, 4):

        path = DATA_DIR / f"database_{i}.csv"

        databases[f"database_{i}"] = pd.read_csv(path)

    return databases


def create_positive_pairs(databases):

    pairs = []

    db1 = databases["database_1"]
    db2 = databases["database_2"]
    db3 = databases["database_3"]

    # Same row across different databases
    for i in range(len(db1)):

        records = [
            db1.iloc[i].to_dict(),
            db2.iloc[i].to_dict(),
            db3.iloc[i].to_dict()
        ]

        # DB1 ↔ DB2
        pairs.append(
            (records[0], records[1], 1)
        )

        # DB1 ↔ DB3
        pairs.append(
            (records[0], records[2], 1)
        )

        # DB2 ↔ DB3
        pairs.append(
            (records[1], records[2], 1)
        )

    return pairs


def create_negative_pairs(databases, number_of_pairs):

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

        # Make sure we didn't accidentally choose
        # the same underlying student.
        if i == j:
            continue

        record1 = db1.iloc[i].to_dict()
        record2 = db2.iloc[j].to_dict()

        pairs.append(
            (record1, record2, 0)
        )

    return pairs


def convert_to_training_dataframe(pairs):

    rows = []

    for record1, record2, label in pairs:

        features = extract_features(
            record1,
            record2
        )

        rows.append({
            **features,
            "label": label
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":

    random.seed(42)

    print("Loading databases...")

    databases = load_databases()

    print("Generating positive pairs...")

    positive_pairs = create_positive_pairs(
        databases
    )

    print(
        f"Positive pairs: "
        f"{len(positive_pairs)}"
    )

    print("Generating negative pairs...")

    negative_pairs = create_negative_pairs(
        databases,
        len(positive_pairs)
    )

    print(
        f"Negative pairs: "
        f"{len(negative_pairs)}"
    )

    all_pairs = (
        positive_pairs +
        negative_pairs
    )

    random.shuffle(all_pairs)

    print("Extracting features...")

    training_data = convert_to_training_dataframe(
        all_pairs
    )

    output_path = DATA_DIR / "training_pairs.csv"

    training_data.to_csv(
        output_path,
        index=False
    )

    print()
    print("=" * 50)
    print("TRAINING DATA GENERATED")
    print("=" * 50)

    print(f"Total pairs : {len(training_data)}")
    print(
        f"Positive    : "
        f"{sum(training_data['label'] == 1)}"
    )
    print(
        f"Negative    : "
        f"{sum(training_data['label'] == 0)}"
    )

    print(f"\nSaved to: {output_path}")
    