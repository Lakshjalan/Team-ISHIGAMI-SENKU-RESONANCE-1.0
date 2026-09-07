import random
import pandas as pd
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


# ---------------------------------------------------------
# STUDENT DATA
# ---------------------------------------------------------

first_names = [
    "Rahul", "Priya", "Arjun", "Ananya", "Vikram",
    "Neha", "Karthik", "Sneha", "Rohan", "Aditi",
    "Aditya", "Meera", "Sanjay", "Kavya", "Nikhil",
    "Pooja", "Varun", "Ishita", "Akash", "Riya",
    "Aman", "Shreya", "Harsh", "Divya", "Abhishek",
    "Nandini", "Siddharth", "Tanvi", "Yash", "Simran"
]


last_names = [
    "Sharma", "Reddy", "Kumar", "Singh", "Rao",
    "Patel", "Iyer", "Verma", "Gupta", "Nair",
    "Mehta", "Joshi", "Agarwal", "Malhotra", "Bansal"
]


# ---------------------------------------------------------
# BRANCH CONFIGURATION
# ---------------------------------------------------------

branch_config = {

    "CSE": {
        "code": "BCE",
        "variations": [
            "CSE",
            "Computer Science",
            "Computer Science and Engineering"
        ]
    },

    "AI/ML": {
        "code": "BAI",
        "variations": [
            "AI/ML",
            "AI & ML",
            "Artificial Intelligence and Machine Learning",
            "Artificial Intelligence & Machine Learning"
        ]
    },

    "ECE": {
        "code": "BEC",
        "variations": [
            "ECE",
            "Electronics",
            "Electronics and Communication",
            "Electronics and Communication Engineering"
        ]
    },

    "EEE": {
        "code": "EEE",
        "variations": [
            "EEE",
            "Electrical",
            "Electrical and Electronics",
            "Electrical and Electronics Engineering"
        ]
    },

    "AI/R": {
        "code": "BRS",
        "variations": [
            "AI/R",
            "AI & Robotics",
            "Artificial Intelligence and Robotics"
        ]
    },

    "MECH": {
        "code": "BMH",
        "variations": [
            "MECH",
            "Mechanical",
            "Mechanical Engineering"
        ]
    }
}


course_variations = [
    "B.Tech",
    "BTech",
    "Bachelor of Technology"
]


# ---------------------------------------------------------
# GENERATE 100 UNIQUE STUDENTS
# ---------------------------------------------------------

def generate_students(count=100):

    students = []

    used_combinations = set()

    for i in range(count):

        # Make sure generated names are not excessively duplicated
        while True:

            first = random.choice(first_names)
            last = random.choice(last_names)

            combination = (first, last)

            if combination not in used_combinations:
                used_combinations.add(combination)
                break

        name = f"{first} {last}"

        email = (
            f"{first.lower()}.{last.lower()}"
            f"{random.randint(1, 999)}@gmail.com"
        )

        phone = (
            "9" +
            "".join(
                str(random.randint(0, 9))
                for _ in range(9)
            )
        )

        branch = random.choice(
            list(branch_config.keys())
        )

        # Admission year
        admission_year = random.randint(21, 26)

        # DOB based loosely on admission year
        birth_year = admission_year + 1980

        month = random.randint(1, 12)
        day = random.randint(1, 28)

        dob = (
            f"{birth_year:04d}-"
            f"{month:02d}-"
            f"{day:02d}"
        )

        students.append({
            "student_id": f"STU{i + 1:04d}",
            "name": name,
            "email": email,
            "phone": phone,
            "branch": branch,
            "course": "B.Tech",
            "DOB": dob,
            "admission_year": admission_year
        })

    return students


# ---------------------------------------------------------
# GENERATE REGISTRATION NUMBER
# ---------------------------------------------------------

def generate_reg_no(student):

    branch = student["branch"]

    branch_code = branch_config[branch]["code"]

    year = student["admission_year"]

    roll_number = random.randint(1000, 9999)

    return (
        f"{year}"
        f"{branch_code}"
        f"{roll_number}"
    )


# ---------------------------------------------------------
# CREATE DATABASE
# ---------------------------------------------------------

def create_database(students, database_number):

    records = []

    for student in students:

        record = student.copy()

        # ---------------------------------------------
        # Registration number
        # ---------------------------------------------

        record["reg_no"] = generate_reg_no(student)

        # ---------------------------------------------
        # Name variations
        # ---------------------------------------------

        if database_number != 1:

            variation = random.randint(1, 4)

            parts = student["name"].split()

            if variation == 1:
                # Rahul Sharma → Rahul K Sharma
                record["name"] = (
                    f"{parts[0]} K {parts[-1]}"
                )

            elif variation == 2:
                # Rahul Sharma → R Sharma
                record["name"] = (
                    f"{parts[0][0]} {parts[-1]}"
                )

            elif variation == 3:
                # Rahul Sharma → Rahul Sharma
                record["name"] = student["name"].lower()

            else:
                # Keep original
                record["name"] = student["name"]

        # ---------------------------------------------
        # Email variations
        # ---------------------------------------------

        if database_number == 3:

            # Some records have slightly different emails
            if random.random() < 0.25:

                email_parts = student["email"].split("@")

                record["email"] = (
                    email_parts[0] +
                    "@outlook.com"
                )

        # ---------------------------------------------
        # Phone variations
        # ---------------------------------------------

        if database_number == 3:

            if random.random() < 0.10:

                # Add +91 formatting
                record["phone"] = (
                    "+91 " + student["phone"]
                )

        # ---------------------------------------------
        # Branch variation
        # ---------------------------------------------

        record["branch"] = random.choice(
            branch_config[
                student["branch"]
            ]["variations"]
        )

        # ---------------------------------------------
        # Course variation
        # ---------------------------------------------

        record["course"] = random.choice(
            course_variations
        )

        # ---------------------------------------------
        # Keep only required fields
        # ---------------------------------------------

        record = {
            "reg_no": record["reg_no"],
            "name": record["name"],
            "email": record["email"],
            "phone": record["phone"],
            "branch": record["branch"],
            "course": record["course"],
            "DOB": record["DOB"]
        }

        records.append(record)

    return records


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

if __name__ == "__main__":

    random.seed(42)

    print("Generating students...")

    students = generate_students(100)

    print("Creating databases...")

    db1 = create_database(students, 1)
    db2 = create_database(students, 2)
    db3 = create_database(students, 3)

    # ---------------------------------------------
    # Save CSV files
    # ---------------------------------------------

    pd.DataFrame(db1).to_csv(
        DATA_DIR / "database_1.csv",
        index=False
    )

    pd.DataFrame(db2).to_csv(
        DATA_DIR / "database_2.csv",
        index=False
    )

    pd.DataFrame(db3).to_csv(
        DATA_DIR / "database_3.csv",
        index=False
    )

    print()
    print("=" * 50)
    print("DATABASE GENERATION COMPLETE")
    print("=" * 50)

    print(f"Database 1: {len(db1)} records")
    print(f"Database 2: {len(db2)} records")
    print(f"Database 3: {len(db3)} records")