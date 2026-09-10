import random
import pandas as pd
from pathlib import Path
from datetime import date, timedelta


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


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


first_names = [
    "Aarav", "Arjun", "Aditya", "Rahul", "Rohan",
    "Karthik", "Vivek", "Akash", "Nikhil", "Varun",
    "Ananya", "Aisha", "Ishita", "Shreya", "Priya",
    "Sneha", "Kavya", "Meera", "Diya", "Riya",
    "Neha", "Pooja", "Anjali", "Tanvi", "Sanya"
]


last_names = [
    "Sharma", "Kumar", "Reddy", "Patel", "Iyer",
    "Nair", "Rao", "Verma", "Singh", "Gupta",
    "Mehta", "Joshi", "Desai", "Pillai", "Menon",
    "Kapoor", "Mishra", "Agarwal", "Bose", "Das"
]


def generate_phone(used_phones):
    while True:
        phone = "9" + "".join(str(random.randint(0, 9)) for _ in range(9))

        if phone not in used_phones:
            used_phones.add(phone)
            return phone


def generate_email(name, used_emails):
    username = name.lower().replace(" ", ".")

    while True:
        number = random.randint(100, 999)
        domain = random.choice([
            "gmail.com",
            "outlook.com",
            "yahoo.com"
        ])

        email = f"{username}{number}@{domain}"

        if email not in used_emails:
            used_emails.add(email)
            return email


def generate_dob(admission_year):
    birth_year = admission_year - random.randint(17, 19)

    start = date(birth_year, 1, 1)
    end = date(birth_year, 12, 31)

    random_days = random.randint(
        0,
        (end - start).days
    )

    dob = start + timedelta(days=random_days)

    return dob.strftime("%Y-%m-%d")


def generate_reg_no(admission_year, branch, used_reg_nos):
    code = branch_config[branch]["code"]

    while True:
        roll = random.randint(1000, 9999)

        reg_no = f"{str(admission_year)[-2:]}{code}{roll}"

        if reg_no not in used_reg_nos:
            used_reg_nos.add(reg_no)
            return reg_no


def vary_name(name):
    parts = name.split()

    choice = random.randint(1, 6)

    if choice == 1:
        return f"{parts[0]} K {parts[-1]}"

    elif choice == 2:
        return f"{parts[0][0]}. {parts[-1]}"

    elif choice == 3:
        return name.lower()

    elif choice == 4:
        return name.replace(" ", "")

    elif choice == 5:
        if len(name) > 4:
            chars = list(name)
            index = random.randint(1, len(chars) - 2)
            chars[index], chars[index + 1] = (
                chars[index + 1],
                chars[index]
            )
            return "".join(chars)

    return name


def vary_email(email):
    username, domain = email.split("@")

    choice = random.randint(1, 4)

    if choice == 1:
        return f"{username}@outlook.com"

    elif choice == 2:
        return f"{username.replace('.', '')}@{domain}"

    elif choice == 3:
        return f"{username}@yahoo.com"

    return email


def vary_phone(phone):
    choice = random.randint(1, 4)

    if choice == 1:
        return f"+91 {phone}"

    elif choice == 2:
        return f"+91-{phone[:5]}-{phone[5:]}"

    elif choice == 3:
        return "0" + phone

    return phone


def vary_dob_format(dob):
    year, month, day = dob.split("-")

    choice = random.randint(1, 3)

    if choice == 1:
        return f"{day}-{month}-{year}"

    elif choice == 2:
        return f"{day}/{month}/{year}"

    return dob


def create_wrong_dob(dob):
    year, month, day = map(int, dob.split("-"))

    wrong_date = date(year, month, day) + timedelta(days=1)

    return wrong_date.strftime("%Y-%m-%d")


def create_wrong_phone(phone):
    digits = list(phone)

    index = random.randint(0, len(digits) - 1)

    original = digits[index]

    new_digit = str(random.randint(0, 9))

    while new_digit == original:
        new_digit = str(random.randint(0, 9))

    digits[index] = new_digit

    return "".join(digits)


def create_student(
    student_number,
    name,
    admission_year,
    branch,
    course,
    dob,
    used_emails,
    used_phones,
    used_reg_nos
):
    email = generate_email(name, used_emails)
    phone = generate_phone(used_phones)

    return {
        "student_id": f"STU{student_number:04d}",
        "reg_no": generate_reg_no(
            admission_year,
            branch,
            used_reg_nos
        ),
        "name": name,
        "email": email,
        "phone": phone,
        "branch": branch,
        "course": course,
        "DOB": dob,
        "admission_year": admission_year
    }


def generate_students(total_students=100):
    students = []

    used_names = set()
    used_emails = set()
    used_phones = set()
    used_reg_nos = set()

    student_number = 1

    # --------------------------------------------------
    # 82 normal students
    # --------------------------------------------------

    while len(students) < 82:

        name = (
            f"{random.choice(first_names)} "
            f"{random.choice(last_names)}"
        )

        if name in used_names:
            continue

        used_names.add(name)

        admission_year = random.randint(2021, 2026)

        branch = random.choice(
            list(branch_config.keys())
        )

        course = "B.Tech"

        dob = generate_dob(admission_year)

        student = create_student(
            student_number,
            name,
            admission_year,
            branch,
            course,
            dob,
            used_emails,
            used_phones,
            used_reg_nos
        )

        students.append(student)

        student_number += 1

    # --------------------------------------------------
    # 6 CONFUSABLE GROUPS × 3 STUDENTS = 18 students
    #
    # These are DIFFERENT people but deliberately share:
    # name + DOB + branch + course
    #
    # Email and phone remain unique.
    # --------------------------------------------------

    confusable_groups = 6

    while len(students) < total_students:

        group_name = (
            f"{random.choice(first_names)} "
            f"{random.choice(last_names)}"
        )

        if group_name in used_names:
            continue

        used_names.add(group_name)

        admission_year = random.randint(2021, 2026)

        branch = random.choice(
            list(branch_config.keys())
        )

        course = "B.Tech"

        shared_dob = generate_dob(admission_year)

        for _ in range(3):

            student = create_student(
                student_number,
                group_name,
                admission_year,
                branch,
                course,
                shared_dob,
                used_emails,
                used_phones,
                used_reg_nos
            )

            students.append(student)

            student_number += 1

        if len(students) >= total_students:
            break

    return students


def create_database(students, database_number):

    records = []

    for student in students:

        record = {
            "reg_no": student["reg_no"],
            "name": student["name"],
            "email": student["email"],
            "phone": student["phone"],
            "branch": student["branch"],
            "course": student["course"],
            "DOB": student["DOB"]
        }

        # ----------------------------------------------
        # DATABASE 2
        # ----------------------------------------------

        if database_number == 2:

            if random.random() < 0.35:
                record["name"] = vary_name(
                    record["name"]
                )

            if random.random() < 0.15:
                record["email"] = vary_email(
                    record["email"]
                )

            if random.random() < 0.15:
                record["phone"] = vary_phone(
                    record["phone"]
                )

            if random.random() < 0.20:
                record["DOB"] = vary_dob_format(
                    record["DOB"]
                )

        # ----------------------------------------------
        # DATABASE 3
        # ----------------------------------------------

        elif database_number == 3:

            if random.random() < 0.50:
                record["name"] = vary_name(
                    record["name"]
                )

            if random.random() < 0.25:
                record["email"] = vary_email(
                    record["email"]
                )

            if random.random() < 0.20:
                record["phone"] = vary_phone(
                    record["phone"]
                )

            if random.random() < 0.30:
                record["DOB"] = vary_dob_format(
                    record["DOB"]
                )

            # Missing values
            if random.random() < 0.08:
                record["email"] = ""

            if random.random() < 0.08:
                record["phone"] = ""

            if random.random() < 0.05:
                record["DOB"] = ""

            # Wrong DOB
            if (
                record["DOB"]
                and random.random() < 0.05
            ):
                record["DOB"] = create_wrong_dob(
                    student["DOB"]
                )

            # Wrong phone
            if (
                record["phone"]
                and random.random() < 0.05
            ):
                record["phone"] = create_wrong_phone(
                    student["phone"]
                )

        # ----------------------------------------------
        # Academic field variations
        # ----------------------------------------------

        record["branch"] = random.choice(
            branch_config[student["branch"]]["variations"]
        )

        record["course"] = random.choice(
            course_variations
        )

        records.append(record)

    return pd.DataFrame(records)


def main():

    DATA_DIR.mkdir(exist_ok=True)

    students = generate_students(100)

    database_1 = create_database(
        students,
        1
    )

    database_2 = create_database(
        students,
        2
    )

    database_3 = create_database(
        students,
        3
    )

    database_1.to_csv(
        DATA_DIR / "database_1.csv",
        index=False
    )

    database_2.to_csv(
        DATA_DIR / "database_2.csv",
        index=False
    )

    database_3.to_csv(
        DATA_DIR / "database_3.csv",
        index=False
    )

    print("=" * 60)
    print("RESONANCE ML V0.2 DATABASE GENERATION COMPLETE")
    print("=" * 60)

    print(f"Database 1: {len(database_1)} records")
    print(f"Database 2: {len(database_2)} records")
    print(f"Database 3: {len(database_3)} records")

    print("\nDesigned confusable entities:")
    print("6 groups × 3 students")
    print("Shared: name + DOB + branch + course")
    print("Different: email + phone")

    print("\nFiles generated:")
    print(DATA_DIR / "database_1.csv")
    print(DATA_DIR / "database_2.csv")
    print(DATA_DIR / "database_3.csv")


if __name__ == "__main__":
    main()