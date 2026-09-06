// All data below is modelled as flat rows so it can be swapped for a
// Google Sheets source without changing component code. Each exported array
// maps 1:1 to a sheet/tab; every field is a primitive column value.

export type TabId = 'arrival' | 'transit' | 'pois' | 'stay' | 'food'

export const city = {
  name: 'Lisbon',
  country: 'Portugal',
  tagline: 'Seven hills, one river, endless light.',
  code: 'LIS',
  timezone: 'WET · GMT+0',
  updated: 'Aug 2026',
  // Map defaults (Sheet: city)
  lat: 38.7169,
  lng: -9.1399,
  zoom: 13,
}

export const stats = [
  { label: 'Metro lines', value: '4' },
  { label: 'Single fare', value: '€1.80' },
  { label: 'Airport → centre', value: '20 min' },
  { label: 'Walk score', value: '88' },
]

/* ------------------------------------------------------------------ */
/* 1. Arrival & Intercity (Sheet: arrival)                             */
/* ------------------------------------------------------------------ */

export type AffiliateLink = {
  label: string
  href: string
}

export type ArrivalMethod = {
  id: string
  mode: 'flight' | 'bus' | 'train'
  title: string
  hub: string
  toCentre: string
  detail: string
  affiliates: AffiliateLink[]
}

export const arrivalMethods: ArrivalMethod[] = [
  {
    id: 'flight',
    mode: 'flight',
    title: 'By Air',
    hub: 'Humberto Delgado Airport (LIS)',
    toCentre: 'Metro Red line · 20 min to centre',
    detail:
      'Europe’s main gateway to Lisbon, 7 km north of downtown. The Red (Vermelha) metro line runs straight from the terminal into the city.',
    affiliates: [{ label: 'Search flights', href: '#search-flights' }],
  },
  {
    id: 'bus',
    mode: 'bus',
    title: 'By Bus',
    hub: 'Sete Rios & Oriente coach stations',
    toCentre: 'Metro Blue / Red line · 10–15 min',
    detail:
      'Long-distance coaches arrive at Sete Rios and Gare do Oriente, both directly on the metro network for an easy transfer downtown.',
    affiliates: [
      { label: 'Obilet', href: '#obilet' },
      { label: 'FlixBus', href: '#flixbus' },
    ],
  },
  {
    id: 'train',
    mode: 'train',
    title: 'By Train',
    hub: 'Santa Apolónia & Oriente',
    toCentre: 'Metro Blue line · direct to centre',
    detail:
      'National and international trains terminate at Santa Apolónia and Oriente. Both connect to the metro, and regional lines link Sintra and Cascais.',
    affiliates: [{ label: 'Book train tickets', href: '#train-tickets' }],
  },
]

/* ------------------------------------------------------------------ */
/* 2. Transit & Card Guide (Sheet: transit)                            */
/* ------------------------------------------------------------------ */

export const transitCard = {
  name: 'Viva Viagem / Navegante',
  issuer: 'Carris · Metropolitano de Lisboa',
  whereToBuy:
    'Metro station machines, ticket desks, CP rail counters and Payshop kiosks.',
  cardCost: '€0.50 (reusable, valid 1 year)',
  topUp:
    'Reload at any yellow metro machine or Payshop point with cash or card. “Zapping” credit works across metro, tram, bus, ferry and urban trains.',
  contactless: 'active',
  qr: 'pilot',
}

export type Fare = {
  type: string
  price: string
  note: string
}

export const fares: Fare[] = [
  {
    type: 'Single (Zapping)',
    price: '€1.61',
    note: 'Pay-as-you-go per trip on metro, tram and bus.',
  },
  {
    type: 'Single (paper)',
    price: '€1.80',
    note: 'One journey loaded on a Viva Viagem card.',
  },
  {
    type: '24h city pass',
    price: '€6.80',
    note: 'Unlimited metro, tram, bus and funiculars for one day.',
  },
  {
    type: '24h + ferry / train',
    price: '€10.70',
    note: 'Adds Transtejo ferries and urban CP trains.',
  },
]

/* ------------------------------------------------------------------ */
/* 3. Points of Interest + Map (Sheet: pois)                           */
/* ------------------------------------------------------------------ */

export type Poi = {
  id: string
  name: string
  category: string
  nearestStop: string
  walk: string
  blurb: string
  lat: number
  lng: number
}

export const pois: Poi[] = [
  {
    id: 'castelo',
    name: 'São Jorge Castle',
    category: 'Landmark',
    nearestStop: 'Tram 28 · Miradouro',
    walk: '6 min',
    blurb: 'Moorish ramparts crowning the city with river-wide views.',
    lat: 38.7139,
    lng: -9.1335,
  },
  {
    id: 'alfama',
    name: 'Portas do Sol',
    category: 'Viewpoint',
    nearestStop: 'Tram 28 · Portas do Sol',
    walk: '1 min',
    blurb: 'The classic terracotta-rooftop terrace over Alfama.',
    lat: 38.7118,
    lng: -9.13,
  },
  {
    id: 'comercio',
    name: 'Praça do Comércio',
    category: 'Square',
    nearestStop: 'Metro · Terreiro do Paço',
    walk: '3 min',
    blurb: 'Grand riverside plaza and the ceremonial gate to the city.',
    lat: 38.7077,
    lng: -9.1366,
  },
  {
    id: 'timeout',
    name: 'Time Out Market',
    category: 'Food Hall',
    nearestStop: 'Metro · Cais do Sodré',
    walk: '2 min',
    blurb: 'Forty kitchens under one roof beside the Green line terminus.',
    lat: 38.7071,
    lng: -9.1459,
  },
  {
    id: 'jeronimos',
    name: 'Jerónimos Monastery',
    category: 'Landmark',
    nearestStop: 'Tram 15 · Belém',
    walk: '4 min',
    blurb: 'Manueline masterpiece at the heart of riverside Belém.',
    lat: 38.6979,
    lng: -9.2065,
  },
  {
    id: 'torre',
    name: 'Belém Tower',
    category: 'Landmark',
    nearestStop: 'Tram 15 · Belém',
    walk: '9 min',
    blurb: '16th-century fortress standing guard at the Tejo’s mouth.',
    lat: 38.6916,
    lng: -9.216,
  },
  {
    id: 'lxfactory',
    name: 'LX Factory',
    category: 'District',
    nearestStop: 'Tram 15 · Calvário',
    walk: '5 min',
    blurb: 'Converted industrial yard of shops, cafés and street art.',
    lat: 38.7036,
    lng: -9.1786,
  },
]

/* ------------------------------------------------------------------ */
/* 4. Where to Stay (Sheet: stay)                                      */
/* ------------------------------------------------------------------ */

export type StayArea = {
  area: string
  transit: string
  vibe: string
  options: StayOption[]
}

export type StayOption = {
  kind: 'Hostel' | 'Hotel' | 'Apartment'
  name: string
  price: string
  note: string
  affiliates: AffiliateLink[]
}

export const stayAreas: StayArea[] = [
  {
    area: 'Baixa & Chiado',
    transit: 'Blue & Green metro · Tram 28',
    vibe: 'Central, walkable, on every line — ideal for a first visit.',
    options: [
      {
        kind: 'Hostel',
        name: 'Lisbon Downtown Hostel',
        price: '€',
        note: 'Social dorms steps from Rossio station.',
        affiliates: [{ label: 'Hostelworld', href: '#hostelworld' }],
      },
      {
        kind: 'Hotel',
        name: 'Chiado Boutique Rooms',
        price: '€€€',
        note: 'Quiet design rooms above the shopping streets.',
        affiliates: [{ label: 'Booking.com', href: '#booking' }],
      },
      {
        kind: 'Apartment',
        name: 'Baixa Tiled Loft',
        price: '€€',
        note: 'Self-check-in flat one block from the metro.',
        affiliates: [{ label: 'Airbnb', href: '#airbnb' }],
      },
    ],
  },
  {
    area: 'Alfama',
    transit: 'Tram 28 · Metro Santa Apolónia',
    vibe: 'Historic lanes and fado houses, best for atmosphere.',
    options: [
      {
        kind: 'Hostel',
        name: 'Alfama Patio Hostel',
        price: '€',
        note: 'Garden courtyard tucked in the old quarter.',
        affiliates: [{ label: 'Hostelworld', href: '#hostelworld' }],
      },
      {
        kind: 'Hotel',
        name: 'Miradouro Guesthouse',
        price: '€€',
        note: 'River-view rooms beside a viewpoint terrace.',
        affiliates: [{ label: 'Booking.com', href: '#booking' }],
      },
      {
        kind: 'Apartment',
        name: 'Fado Lane Studio',
        price: '€€',
        note: 'Compact studio on a stepped cobbled street.',
        affiliates: [{ label: 'Airbnb', href: '#airbnb' }],
      },
    ],
  },
  {
    area: 'Parque das Nações',
    transit: 'Red metro · Oriente station',
    vibe: 'Modern riverside district by the transport hub.',
    options: [
      {
        kind: 'Hostel',
        name: 'Oriente Riverside Hostel',
        price: '€',
        note: 'Bright bunks a short walk from Oriente.',
        affiliates: [{ label: 'Hostelworld', href: '#hostelworld' }],
      },
      {
        kind: 'Hotel',
        name: 'Nations Waterfront Hotel',
        price: '€€€',
        note: 'Business-friendly tower over the marina.',
        affiliates: [{ label: 'Booking.com', href: '#booking' }],
      },
      {
        kind: 'Apartment',
        name: 'Marina View Flat',
        price: '€€',
        note: 'Family apartment with balcony and metro at the door.',
        affiliates: [{ label: 'Airbnb', href: '#airbnb' }],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* 5. Local Food — 100% ad-free (Sheet: food)                          */
/* ------------------------------------------------------------------ */

export type LocalDish = {
  dish: string
  venue: string
  nearestStop: string
  note: string
}

export const localFood: LocalDish[] = [
  {
    dish: 'Pastel de nata',
    venue: 'Manteigaria',
    nearestStop: 'Metro · Baixa-Chiado',
    note: 'Warm custard tart, cinnamon on the side.',
  },
  {
    dish: 'Amêijoas à Bulhão Pato',
    venue: 'Cervejaria Ramiro',
    nearestStop: 'Metro · Intendente',
    note: 'Garlic clams and tiger prawns, no reservations.',
  },
  {
    dish: 'Bifana',
    venue: 'O Trevo',
    nearestStop: 'Metro · Baixa-Chiado',
    note: 'Marinated pork roll on Praça Luís de Camões.',
  },
  {
    dish: 'Bacalhau à Brás',
    venue: 'O Velho Eurico',
    nearestStop: 'Tram 28 · Sé',
    note: 'Salt-cod, egg and potato — the Alfama classic.',
  },
  {
    dish: 'Ginjinha',
    venue: 'A Ginjinha',
    nearestStop: 'Metro · Rossio',
    note: 'Sour-cherry liqueur served at a standing counter.',
  },
  {
    dish: 'Grilled sardines',
    venue: 'Ponto Final (Cacilhas)',
    nearestStop: 'Ferry · Cais do Sodré',
    note: 'Riverside table facing the city skyline.',
  },
]
