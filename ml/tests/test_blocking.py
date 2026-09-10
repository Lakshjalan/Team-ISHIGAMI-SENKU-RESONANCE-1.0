import pandas as pd

from src.blocking import build_block_index, find_candidates
from src.normalization import normalize_record


# Load our databases
database_1 = pd.read_csv("data/database_1.csv")
database_2 = pd.read_csv("data/database_2.csv")
database_3 = pd.read_csv("data/database_3.csv")

databases = {
    "database_1": database_1,
    "database_2": database_2,
    "database_3": database_3
}


# Normalize database records first
for database_name, dataframe in databases.items():

    databases[database_name] = dataframe.map(
        lambda value: value.strip().lower()
        if isinstance(value, str)
        else value
    )


# Build blocking index
block_index = build_block_index(databases)


# Input record
input_record = {
    "reg_no": "INPUT",
    "name": "rahul sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "cse",
    "course": "btech",
    "DOB": "2005-03-14"
}


# Find candidates
candidates = find_candidates(
    input_record,
    block_index
)


print("\nBlocking results")
print("=" * 50)

print(f"Candidates found: {len(candidates)}")

for candidate in candidates:

    print(
        f"\nDatabase: {candidate['database']}"
    )

    print(
        f"Registration No: "
        f"{candidate['record']['reg_no']}"
    )

    print(
        f"Name: "
        f"{candidate['record']['name']}"
    )