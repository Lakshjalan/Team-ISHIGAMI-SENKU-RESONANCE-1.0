def generate_blocking_keys(record):
    """
    Generate multiple keys that can be used to find
    potentially matching records.
    """

    name = record["name"]
    email = record["email"]
    phone = record["phone"]
    branch = record["branch"]
    dob = record["DOB"]

    keys = []

    # Strong identifiers
    if email:
        keys.append(("email", email))

    if phone:
        keys.append(("phone", phone))

    # Combination-based blocking
    if name and dob:
        keys.append(("name_dob", name, dob))

    if dob and branch:
        keys.append(("dob_branch", dob, branch))

    return keys


def build_block_index(databases):
    """
    Build an index of all records across all databases.

    The index allows us to quickly find candidate records.
    """

    block_index = {}

    for database_name, dataframe in databases.items():

        for _, row in dataframe.iterrows():

            record = row.to_dict()

            keys = generate_blocking_keys(record)

            for key in keys:

                if key not in block_index:
                    block_index[key] = []

                block_index[key].append({
                    "database": database_name,
                    "record": record
                })

    return block_index


def find_candidates(input_record, block_index):
    """
    Find candidate records that share at least one
    blocking key with the input record.
    """

    keys = generate_blocking_keys(input_record)

    candidates = {}

    for key in keys:

        matching_records = block_index.get(key, [])

        for item in matching_records:

            record = item["record"]

            unique_id = (
                item["database"],
                record["reg_no"]
            )

            candidates[unique_id] = item

    return list(candidates.values())