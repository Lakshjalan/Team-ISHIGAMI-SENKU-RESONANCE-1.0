from src.feature_extraction import extract_features


record1 = {
    "name": "Rahul Sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "CSE",
    "course": "B.Tech",
    "DOB": "2005-03-14"
}

record2 = {
    "name": "Rahul K Sharma",
    "email": "rahul.sharma@gmail.com",
    "phone": "9876543210",
    "branch": "CSE",
    "course": "Computer Science and Engineering",
    "DOB": "2005-03-14"
}


features = extract_features(record1, record2)

print("Feature comparison:")
print("-" * 40)

for feature, score in features.items():
    print(f"{feature:<20} : {score:.2f}")