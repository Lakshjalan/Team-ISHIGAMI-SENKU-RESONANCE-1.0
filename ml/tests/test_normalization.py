from src.normalization import normalize_record


record = {
    "reg_no": "24CSE2045",
    "name": "  Rahul K Sharma  ",
    "email": "RAHUL.SHARMA@GMAIL.COM",
    "phone": "+91 98765-43210",
    "branch": "Computer Science and Engineering",
    "course": "Bachelor of Technology",
    "DOB": "2005-03-14"
}


normalized = normalize_record(record)

print("Original record:")
print(record)

print("\nNormalized record:")
print(normalized)