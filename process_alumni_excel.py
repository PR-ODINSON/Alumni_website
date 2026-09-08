import pandas as pd
import numpy as np
import random
import string
import json
import os

# Set seed for reproducible password generation
random.seed(42)

def generate_random_password():
    upper = random.choice(string.ascii_uppercase)
    lower = random.choice(string.ascii_lowercase)
    digit = random.choice(string.digits)
    special = random.choice("@#$%&!")
    all_chars = string.ascii_letters + string.digits + "@#$%&!"
    rest = "".join(random.choice(all_chars) for _ in range(6))
    pwd_list = list(upper + lower + digit + special + rest)
    random.shuffle(pwd_list)
    return "".join(pwd_list)

# Map convocation photo files by enrollment number
convocation_photos_dir = '20260903_8th_Convocation_Students_Images'
photo_map = {}
if os.path.exists(convocation_photos_dir):
    for f in os.listdir(convocation_photos_dir):
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            enr = os.path.splitext(f)[0].strip()
            ext = os.path.splitext(f)[1].lower()
            photo_map[enr] = f'/convocation_photos/{enr}{ext}'

print(f"Loaded {len(photo_map)} convocation student photos.")

# Load Sheet1 starting from header row index 5
excel_path = 'Annex_19A_Alumni_Donation_Clean.xlsx'
df = pd.read_excel(excel_path, sheet_name='Sheet1', header=5)
df = df.dropna(how='all')

# Clean columns
df.columns = [c.strip() if isinstance(c, str) else c for c in df.columns]

processed_records = []
credentials_rows = []
seen_enrs = set()

gen_counter = 1

for idx, row in df.iterrows():
    particular = str(row.get('Particular', '')).strip() if pd.notnull(row.get('Particular')) else ''
    if not particular or particular.lower() == 'nan':
        continue
        
    name_parts = particular.split()
    if len(name_parts) == 1:
        first_name = name_parts[0]
        last_name = 'Alumni'
    else:
        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:])
        
    raw_enr = row.get('Enrollment Number')
    if pd.notnull(raw_enr) and str(raw_enr).strip().lower() != 'nan':
        try:
            enr_num = str(int(float(raw_enr))).strip()
        except ValueError:
            enr_num = str(raw_enr).strip()
    else:
        enr_num = f"23104000{gen_counter:04d}"
        gen_counter += 1

    seen_enrs.add(enr_num)

    raw_date = row.get('Date of Receipt')
    if pd.notnull(raw_date):
        try:
            receipt_date = pd.to_datetime(raw_date).strftime('%Y-%m-%d')
        except Exception:
            receipt_date = '2023-04-01'
    else:
        receipt_date = '2023-04-01'
        
    raw_amount = row.get('Amount in Rs.')
    try:
        amount = float(raw_amount) if pd.notnull(raw_amount) else 0.0
    except ValueError:
        amount = 0.0

    purpose = str(row.get('Purpuse', '')).strip() if pd.notnull(row.get('Purpuse')) else 'Alumni Contribution'
    if not purpose or purpose.lower() == 'nan':
        purpose = 'Alumni Contribution'

    raw_year = row.get('Graduation year')
    try:
        grad_year = int(float(raw_year)) if pd.notnull(raw_year) else 2023
    except (ValueError, TypeError):
        grad_year = 2023

    degree_type = str(row.get('Degree type', '')).strip() if pd.notnull(row.get('Degree type')) else 'B. Tech'
    if not degree_type or degree_type.lower() == 'nan':
        degree_type = 'B. Tech'
        
    branch = str(row.get('Branch', '')).strip() if pd.notnull(row.get('Branch')) else 'Mechanical'
    if not branch or branch.lower() == 'nan':
        branch = 'Mechanical'

    affiliation = str(row.get('Affiliation', '')).strip() if pd.notnull(row.get('Affiliation')) else ''
    location = str(row.get('Location', '')).strip() if pd.notnull(row.get('Location')) else ''

    password = generate_random_password()
    email = f"{enr_num.lower()}@iitram.ac.in"
    photo_url = photo_map.get(enr_num, '/images/iitram-logo.png')

    rec = {
        'enrollmentNumber': enr_num,
        'firstName': first_name,
        'lastName': last_name,
        'fullName': f"{first_name} {last_name}",
        'email': email,
        'password': password,
        'hasDonated': True,
        'donationAmount': amount,
        'receiptDate': receipt_date,
        'purpose': purpose,
        'affiliation': affiliation,
        'location': location,
        'graduationYear': grad_year,
        'degreeType': degree_type,
        'branch': branch,
        'photoUrl': photo_url
    }
    
    processed_records.append(rec)
    
    credentials_rows.append({
        'Enrollment Number': enr_num,
        'Full Name': f"{first_name} {last_name}",
        'Email': email,
        'Password': password,
        'Has Donated': 'Yes',
        'Donation Amount (Rs)': amount,
        'Receipt Date': receipt_date,
        'Purpose': purpose,
        'Degree': degree_type,
        'Branch': branch,
        'Graduation Year': grad_year,
        'Photo Attached': 'Yes' if enr_num in photo_map else 'Default Logo',
        'Photo URL': photo_url
    })

# Now process Convocation Photos that are not yet in Excel list
added_conv_count = 0
for enr_num, photo_rel_url in photo_map.items():
    if enr_num not in seen_enrs:
        password = generate_random_password()
        email = f"{enr_num.lower()}@iitram.ac.in"
        first_name = "Convocation"
        last_name = f"Graduate {enr_num[-4:]}"
        
        # Derive degree/branch from enrollment code if available
        degree_type = "B. Tech"
        branch = "Computer Engineering" if "104" in enr_num else "Electrical Engineering" if "102" in enr_num else "Civil Engineering"
        grad_year = 2026

        rec = {
            'enrollmentNumber': enr_num,
            'firstName': first_name,
            'lastName': last_name,
            'fullName': f"{first_name} {last_name}",
            'email': email,
            'password': password,
            'hasDonated': True,
            'donationAmount': 1000.0,
            'receiptDate': '2026-09-03',
            'purpose': 'Convocation Alumni Fund',
            'affiliation': 'IITRAM Alumni',
            'location': 'Ahmedabad',
            'graduationYear': grad_year,
            'degreeType': degree_type,
            'branch': branch,
            'photoUrl': photo_rel_url
        }

        processed_records.append(rec)

        credentials_rows.append({
            'Enrollment Number': enr_num,
            'Full Name': f"{first_name} {last_name}",
            'Email': email,
            'Password': password,
            'Has Donated': 'Yes',
            'Donation Amount (Rs)': 1000.0,
            'Receipt Date': '2026-09-03',
            'Purpose': 'Convocation Alumni Fund',
            'Degree': degree_type,
            'Branch': branch,
            'Graduation Year': grad_year,
            'Photo Attached': 'Yes',
            'Photo URL': photo_rel_url
        })
        added_conv_count += 1

print(f"Added {added_conv_count} convocation photo accounts to credentials.")

# Save credentials CSV
creds_df = pd.DataFrame(credentials_rows)
creds_csv_path = 'alumni_credentials.csv'
creds_df.to_csv(creds_csv_path, index=False)
print(f"Successfully updated {creds_csv_path} with {len(creds_df)} total records.")

# Save JSON file for database seed script
json_path = 'alumni_donors_data.json'
with open(json_path, 'w') as f:
    json.dump(processed_records, f, indent=2)

print(f"Saved updated JSON seed data to {json_path}.")
