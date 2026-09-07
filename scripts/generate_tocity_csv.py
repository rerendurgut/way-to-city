import csv
import json

# Known real major airports & stations mapping for key world cities
SPECIAL_ARRIVALS = {
    "Istanbul": [
        {
            "type": "plane",
            "name": "Istanbul Airport (IST)",
            "desc": "Primary international gateway on the European side",
            "link": "https://www.skyscanner.com",
            "put": "Take M11 Metro Line (Gayrettepe - Kağıthane - IST Airport) or Havaist shuttles directly to Taksim & Beşiktaş.",
            "put_link": "https://hava.ist"
        },
        {
            "type": "plane",
            "name": "Sabiha Gokcen Airport (SAW)",
            "desc": "Major international airport on the Asian side",
            "link": "https://www.skyscanner.com",
            "put": "Take M4 Metro Line (Kadıköy - Sabiha Gökçen) or Havabus shuttles directly to Kadıköy & Taksim.",
            "put_link": "https://www.havabuses.com"
        },
        {
            "type": "bus",
            "name": "Esenler Bus Terminal (Buyuk Otogar)",
            "desc": "Main European side intercity coach station",
            "link": "https://www.obilet.com",
            "put": "M1A Metro Line connects directly to Aksaray and Yenikapı transfer hub.",
            "put_link": ""
        },
        {
            "type": "bus",
            "name": "Alibeykoy Coach Terminal",
            "desc": "Modern intercity terminal on the European side",
            "link": "https://www.obilet.com",
            "put": "T5 Tram Line to Eminönü or M7 Metro Line for quick city center transfer.",
            "put_link": ""
        }
    ],
    "Ankara": [
        {
            "type": "plane",
            "name": "Esenboga Airport (ESB)",
            "desc": "Primary airport for the capital city Ankara",
            "link": "https://www.skyscanner.com",
            "put": "Take Belko Air shuttle buses or 442 public bus line to Kizilay and ASTI.",
            "put_link": "https://www.belkoair.com"
        },
        {
            "type": "bus",
            "name": "ASTI Bus Terminal",
            "desc": "Central coach station of Ankara",
            "link": "https://www.obilet.com",
            "put": "Ankaray Light Rail line connects directly to Kizilay and Maltepe.",
            "put_link": ""
        }
    ],
    "Izmir": [
        {
            "type": "plane",
            "name": "Adnan Menderes Airport (ADB)",
            "desc": "Main airport serving Izmir and Aegean region",
            "link": "https://www.skyscanner.com",
            "put": "IZBAN Commuter Train or Havas shuttles connect directly to Alsancak and Karsiyaka.",
            "put_link": "https://www.izban.com.tr"
        }
    ],
    "Bursa": [
        {
            "type": "bus",
            "name": "Bursa Intercity Bus Terminal",
            "desc": "Central coach station connecting major cities",
            "link": "https://www.obilet.com",
            "put": "Take 93/38 coded yellow buses or T2 tram line to city center.",
            "put_link": ""
        },
        {
            "type": "plane",
            "name": "Sabiha Gokcen Airport (SAW)",
            "desc": "Nearest major international airport to Bursa",
            "link": "https://www.skyscanner.com",
            "put": "Take BBBUS directly from SAW airport arrivals to Bursa coach terminal.",
            "put_link": "https://bus.burulas.com.tr"
        }
    ],
    "Budapest": [
        {
            "type": "plane",
            "name": "Budapest Ferenc Liszt Airport (BUD)",
            "desc": "Primary international gateway to Hungary",
            "link": "https://www.skyscanner.com",
            "put": "Take 100E express bus directly to Deak Ferenc ter in city center.",
            "put_link": "https://bkk.hu"
        },
        {
            "type": "train",
            "name": "Keleti Railway Station (Keleti palyaudvar)",
            "desc": "Main international railway terminal",
            "link": "https://www.trainline.com",
            "put": "M2 and M4 metro lines connect directly to the center.",
            "put_link": ""
        }
    ],
    "Paris": [
        {
            "type": "plane",
            "name": "Charles de Gaulle Airport (CDG)",
            "desc": "Primary international airport",
            "link": "https://www.skyscanner.com",
            "put": "Take RER B train directly to Gare du Nord / Chatelet.",
            "put_link": "https://www.ratp.fr"
        },
        {
            "type": "plane",
            "name": "Orly Airport (ORY)",
            "desc": "Secondary airport close to city center",
            "link": "https://www.skyscanner.com",
            "put": "Take Orlyval train to RER B or Metro line 14.",
            "put_link": "https://www.ratp.fr"
        },
        {
            "type": "train",
            "name": "Gare du Nord",
            "desc": "Major railway hub for Eurostar and TGV trains",
            "link": "https://www.trainline.com",
            "put": "Connected to Metro lines 4 and 5.",
            "put_link": ""
        }
    ],
    "Rome": [
        {
            "type": "plane",
            "name": "Leonardo da Vinci–Fiumicino Airport (FCO)",
            "desc": "Main international airport of Rome",
            "link": "https://www.skyscanner.com",
            "put": "Take Leonardo Express train non-stop to Roma Termini.",
            "put_link": "https://www.trenitalia.com"
        },
        {
            "type": "train",
            "name": "Roma Termini Station",
            "desc": "Central railway hub of Rome",
            "link": "https://www.trainline.com",
            "put": "Metro lines A and B intersect here.",
            "put_link": ""
        }
    ],
    "Tokyo": [
        {
            "type": "plane",
            "name": "Tokyo Haneda Airport (HND)",
            "desc": "Closest major airport to central Tokyo",
            "link": "https://www.skyscanner.com",
            "put": "Take Tokyo Monorail or Keikyu Line to Yamanote loop line.",
            "put_link": "https://www.tokyo-monorail.co.jp"
        },
        {
            "type": "plane",
            "name": "Narita International Airport (NRT)",
            "desc": "Primary international hub for long-haul flights",
            "link": "https://www.skyscanner.com",
            "put": "Take JR Narita Express (N'EX) or Keisei Skyliner to Tokyo Station / Shinjuku.",
            "put_link": "https://www.jreast.co.jp"
        }
    ],
    "London": [
        {
            "type": "plane",
            "name": "London Heathrow Airport (LHR)",
            "desc": "Primary hub airport",
            "link": "https://www.skyscanner.com",
            "put": "Take Elizabeth Line or Heathrow Express to Paddington.",
            "put_link": "https://www.heathrowexpress.com"
        },
        {
            "type": "plane",
            "name": "London Gatwick Airport (LGW)",
            "desc": "Major south London airport",
            "link": "https://www.skyscanner.com",
            "put": "Take Gatwick Express or Southern rail to Victoria Station.",
            "put_link": "https://www.gatwickexpress.com"
        }
    ],
    "New York City": [
        {
            "type": "plane",
            "name": "John F. Kennedy International Airport (JFK)",
            "desc": "Primary international gateway",
            "link": "https://www.skyscanner.com",
            "put": "Take JFK AirTrain to Jamaica Station, then LIRR or subway E line to Manhattan.",
            "put_link": "https://new.mta.info"
        }
    ]
}

def main():
    print("Generating tocity (Arrivals) CSV...")
    
    # Read cities from world_cities_sheets.csv
    cities_list = []
    with open('world_cities_sheets.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            cities_list.append((r['country'], r['city']))
            
    out_file = 'world_tocity_sheets.csv'
    row_id = 1
    
    with open(out_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'city', 'type', 'name', 'desc', 'link', 'put', 'put_link'])
        
        for country, city in cities_list:
            if city in SPECIAL_ARRIVALS:
                for item in SPECIAL_ARRIVALS[city]:
                    writer.writerow([
                        row_id,
                        city,
                        item['type'],
                        item['name'],
                        item['desc'],
                        item['link'],
                        item['put'],
                        item['put_link']
                    ])
                    row_id += 1
            else:
                # Standard template for all other cities
                # 1. Plane Route
                writer.writerow([
                    row_id,
                    city,
                    'plane',
                    f"{city} International Airport",
                    f"Main airport connecting {city} to international destinations",
                    "https://www.skyscanner.com",
                    "Take the official airport express bus or taxi directly to city center.",
                    ""
                ])
                row_id += 1
                
                # 2. Train / Bus Route
                writer.writerow([
                    row_id,
                    city,
                    'bus',
                    f"{city} Central Bus Terminal",
                    f"Intercity bus terminal with connections across {country}",
                    "https://www.flixbus.com",
                    "Local city bus or taxi service available outside the terminal.",
                    ""
                ])
                row_id += 1

    print(f"Done! Generated {row_id - 1} arrival options across all cities in '{out_file}'.")

if __name__ == '__main__':
    main()
