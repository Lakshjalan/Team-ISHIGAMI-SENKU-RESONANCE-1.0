import pandas as pd
from pathlib import Path


# Location of the data directory
DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_databases():
    databases = {}

    for csv_file in DATA_DIR.glob("*.csv"):
        databases[csv_file.stem] = pd.read_csv(csv_file)

    return databases


if __name__ == "__main__":
    databases = load_databases()

    for name, df in databases.items():
        print(f"\n{name}")
        print("-" * 40)
        print(df)