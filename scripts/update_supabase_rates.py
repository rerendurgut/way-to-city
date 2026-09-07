import urllib.request
import json
import os

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://yxjzsfcgfgxbhvthqief.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def main():
    print("Fetching live EUR exchange rates from API...")
    url_rates = 'https://open.er-api.com/v6/latest/EUR'
    req = urllib.request.Request(url_rates, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode())
        rates = data.get('rates', {})
        
    print(f"Fetched {len(rates)} live rates.")

    # Fetch existing countries from Supabase
    url_countries = f"{SUPABASE_URL}/rest/v1/countries?select=id,name,currency_short"
    req_c = urllib.request.Request(url_countries, headers=HEADERS)
    with urllib.request.urlopen(req_c) as res:
        countries = json.loads(res.read().decode())
        
    print(f"Updating {len(countries)} countries in Supabase...")
    
    updated_count = 0
    for c in countries:
        cid = c['id']
        curr_short = (c.get('currency_short') or '').upper().strip()
        
        if curr_short == 'EUR':
            rate_val = "1"
        elif curr_short in rates:
            raw_rate = rates[curr_short]
            rate_val = str(round(raw_rate, 2)) if raw_rate >= 10 else str(round(raw_rate, 2))
        else:
            rate_val = ""

        if rate_val:
            # Patch row in Supabase
            url_patch = f"{SUPABASE_URL}/rest/v1/countries?id=eq.{cid}"
            patch_data = {"euro_conversion": rate_val}
            req_p = urllib.request.Request(url_patch, data=json.dumps(patch_data).encode('utf-8'), headers=HEADERS, method='PATCH')
            try:
                with urllib.request.urlopen(req_p) as res:
                    updated_count += 1
            except Exception as e:
                print(f"Error updating {c['name']}: {e}")

    print(f"Done! Successfully updated live exchange rates for {updated_count} countries in Supabase.")

if __name__ == '__main__':
    main()
