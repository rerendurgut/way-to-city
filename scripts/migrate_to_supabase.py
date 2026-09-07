import urllib.request
import json
import csv
import os

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://yxjzsfcgfgxbhvthqief.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def post_to_supabase(table, data):
    if not data:
        return
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=HEADERS, method='POST')
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Successfully migrated {len(data)} rows to '{table}'!")
    except Exception as e:
        print(f"Error migrating to '{table}': {e}")
        if hasattr(e, 'read'):
            print("Server response:", e.read().decode('utf-8'))

def migrate_countries():
    print("Migrating Countries...")
    rows = []
    if os.path.exists('world_countries_sheets.csv'):
        with open('world_countries_sheets.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append({
                    "id": str(r['id']),
                    "name": r['country'],
                    "continent": r['continent'],
                    "currency": r['currency'],
                    "currency_short": r['currency_short'],
                    "euro_conversion": r['euro_conversion'],
                    "esim_link": r['e_sim']
                })
    # Batch post in chunks of 50
    for i in range(0, len(rows), 50):
        post_to_supabase("countries", rows[i:i+50])

def migrate_cities():
    print("Migrating Cities...")
    rows = []
    if os.path.exists('world_cities_sheets.csv'):
        with open('world_cities_sheets.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append({
                    "id": str(r['id']),
                    "country": r['country'],
                    "name": r['city'],
                    "desc": r['desc']
                })
    for i in range(0, len(rows), 50):
        post_to_supabase("cities", rows[i:i+50])

def migrate_tocity():
    print("Migrating Arrivals (ToCity)...")
    rows = []
    if os.path.exists('world_tocity_sheets.csv'):
        with open('world_tocity_sheets.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append({
                    "id": str(r['id']),
                    "city": r['city'],
                    "type": r['type'],
                    "name": r['name'],
                    "desc": r['desc'],
                    "link": r['link'],
                    "note": r['put'],
                    "note_link": r['put_link'],
                    "status": "approved"
                })
    for i in range(0, len(rows), 50):
        post_to_supabase("tocity", rows[i:i+50])

def main():
    migrate_countries()
    migrate_cities()
    migrate_tocity()
    print("Migration finished!")

if __name__ == '__main__':
    main()
