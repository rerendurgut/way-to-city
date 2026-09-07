import urllib.request
import json
import csv

# Slogans template for generating clean descriptions
DEFAULT_SLOGANS = [
    "Historic landmarks, rich culture, and vibrant urban life.",
    "Cultural heart, iconic architecture, and local flavors.",
    "Bustling city center with rich heritage and scenic views.",
    "Vibrant urban hub, ancient history, and local markets.",
    "Capital city filled with history, art, and charm."
]

def main():
    print("Fetching world countries & cities data...")
    url_countries = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
    url_cities = 'https://countriesnow.space/api/v0.1/countries'
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    # 1. Fetch countries mapping (country -> capital)
    req1 = urllib.request.Request(url_countries, headers=headers)
    with urllib.request.urlopen(req1) as res:
        c_raw = json.loads(res.read().decode())
        
    country_capitals = {}
    for c in c_raw:
        name = c.get('name', {}).get('common', '')
        if name in ['Turkiye', 'Türkiye', 'Republic of Türkiye', 'Republic of Turkiye']:
            name = 'Turkey'
        cap = c.get('capital', [''])[0] if c.get('capital') else ''
        if name:
            country_capitals[name] = cap
            
    # 2. Fetch cities per country
    req2 = urllib.request.Request(url_cities, headers=headers)
    with urllib.request.urlopen(req2) as res:
        cities_raw = json.loads(res.read().decode()).get('data', [])
        
    cities_map = {}
    for item in cities_raw:
        c_name = item.get('country', '')
        c_list = item.get('cities', [])
        if c_name:
            cities_map[c_name.lower()] = c_list

    out_file = 'world_cities_sheets.csv'
    
    # Famous top-tier cities override list for popular travel destinations
    popular_cities = {
        "Turkey": ["Istanbul", "Bursa", "Antalya", "Ankara", "Izmir", "Cappadocia"],
        "France": ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"],
        "Italy": ["Rome", "Florence", "Venice", "Milan", "Naples"],
        "Spain": ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
        "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
        "Japan": ["Tokyo", "Kyoto", "Osaka", "Sapporo", "Fukuoka"],
        "United States": ["New York City", "Los Angeles", "Chicago", "Miami", "San Francisco"],
        "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool"],
        "Hungary": ["Budapest", "Debrecen", "Szeged"],
        "Greece": ["Athens", "Santorini", "Mykonos", "Thessaloniki"],
        "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
        "Portugal": ["Lisbon", "Porto", "Faro"],
        "Egypt": ["Cairo", "Alexandria", "Luxor"],
        "Thailand": ["Bangkok", "Phuket", "Chiang Mai"],
        "United Arab Emirates": ["Dubai", "Abu Dhabi"]
    }

    row_id = 1
    with open(out_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'country', 'city', 'desc'])
        
        sorted_countries = sorted(country_capitals.keys())
        
        for country in sorted_countries:
            capital = country_capitals[country]
            
            # Select cities to include for this country
            city_list = []
            if country in popular_cities:
                city_list = popular_cities[country]
            else:
                # Get capital first, then next top cities
                all_c = cities_map.get(country.lower(), [])
                if capital and capital not in city_list:
                    city_list.append(capital)
                for c in all_c:
                    if c not in city_list and len(city_list) < 4:
                        city_list.append(c)
                        
            if not city_list and capital:
                city_list = [capital]
                
            for idx, city in enumerate(city_list):
                if not city:
                    continue
                slogan = DEFAULT_SLOGANS[idx % len(DEFAULT_SLOGANS)]
                if city == capital:
                    slogan = f"Vibrant capital city of {country}, rich in history and culture."
                
                writer.writerow([row_id, country, city, slogan])
                row_id += 1
                
    print(f"Done! Generated {row_id - 1} cities across world countries in '{out_file}'.")

if __name__ == '__main__':
    main()
