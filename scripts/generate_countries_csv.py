import urllib.request
import json
import csv
import sys

def main():
    url = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    print("Fetching world countries data...")
    with urllib.request.urlopen(req) as response:
        countries = json.loads(response.read().decode())
    
    # Sort alphabetically by country name
    countries.sort(key=lambda x: x.get('name', {}).get('common', ''))
    
    out_file = 'world_countries_sheets.csv'
    
    with open(out_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        # Headers matching your Google Sheet "country" tab 1:1
        writer.writerow(['id', 'country', 'continent', 'currency', 'currency_short', 'euro_conversion', 'e_sim'])
        
        row_id = 1
        for c in countries:
            name = c.get('name', {}).get('common', '')
            if name in ['Turkiye', 'Türkiye', 'Republic of Türkiye', 'Republic of Turkiye']:
                name = 'Turkey'
            continent = c.get('region', '')
            
            # Currency details
            currencies = c.get('currencies', {})
            curr_code = ''
            curr_name = ''
            
            if isinstance(currencies, list) and len(currencies) > 0:
                curr_code = currencies[0]
            elif isinstance(currencies, dict) and len(currencies) > 0:
                curr_code = list(currencies.keys())[0]
                curr_info = currencies[curr_code]
                if isinstance(curr_info, dict):
                    curr_name = curr_info.get('name', '')
            
            if not curr_code:
                continue
                
            # Google Finance formula dynamically referencing row (e.g. D2, D3, D4...)
            # Column A = id, B = country, C = continent, D = currency_short
            sheet_row = row_id + 1  # 1 for header
            euro_formula = f'=IF(E{sheet_row}="EUR", 1, ROUND(GOOGLEFINANCE("CURRENCY:EUR" & E{sheet_row}), 2))'
            
            # Map Americas -> Americas / North America / South America if needed, keep region clean
            if continent == 'Americas':
                continent = 'Americas'
            elif continent == 'Polar':
                continue
                
            writer.writerow([
                row_id,
                name,
                continent,
                curr_name or curr_code,
                curr_code,
                euro_formula,
                ''
            ])
            row_id += 1
            
    print(f"Done! Generated {row_id - 1} countries in '{out_file}'.")

if __name__ == '__main__':
    main()
