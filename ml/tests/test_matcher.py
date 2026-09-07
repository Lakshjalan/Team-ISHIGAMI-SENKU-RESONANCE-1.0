from src.pairwise_matcher import compare_records


record1 = {
    "name": "rahul sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "cse",
    "course": "btech",
    "DOB": "2005-03-14"
}


record2 = {
    "name": "R Sharma",
    "email": "r.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "cse",
    "course": "btech",
    "DOB": "2005-03-14"
}


result = compare_records(record1, record2)


print("\nPairwise Matching")
print("=" * 50)

print("\nFeatures:")

for feature, value in result["features"].items():
    print(f"{feature:<20}: {value:.2f}")


print(f"\nMatch Score : {result['score']:.2f}")
print(f"Decision    : {result['classification']}")