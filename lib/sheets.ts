// -----------------------------------------------------------------------------
// WayToCity — live data layer backed by a published Google Sheet.
//
// The sheet has one tab per entity. Each tab is fetched as CSV and parsed into
// typed objects. Data is revalidated hourly so edits in the sheet flow through
// without a redeploy. Column names below match the sheet headers 1:1.
// -----------------------------------------------------------------------------

const PUB =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0-U8cpnHXaaIqYdOW563HYbmprnrGkVaUobPWP-ndVrRwDi5ghFr1J7jYO9Q3jmmpOWYxEqe8IgRF/pub'

const SHEETS = {
  country: '640241325',
  city: '0',
  tocity: '1095022880',
  transport: '15497659',
  poi: '1624281795',
  stay: '626988167',
  food: '1952657740',
} as const

const REVALIDATE_SECONDS = 60

/* ------------------------------ CSV parsing ------------------------------ */

// Minimal RFC-4180 parser: handles quoted fields, escaped quotes ("") and
// embedded commas / newlines.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (c !== '\r') {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

type Row = Record<string, string>

function toObjects(rows: string[][]): Row[] {
  if (rows.length === 0) return []
  const headers = rows[0].map((h) => h.trim())
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) =>
      Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])),
    )
}

async function fetchSheet(name: keyof typeof SHEETS): Promise<Row[]> {
  const url = `${PUB}?gid=${SHEETS[name]}&single=true&output=csv`
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
  if (!res.ok) {
    throw new Error(`Failed to load sheet "${name}" (${res.status})`)
  }
  return toObjects(parseCsv(await res.text()))
}

/* ------------------------------- helpers -------------------------------- */

const eq = (a?: string, b?: string) =>
  (a ?? '').trim().toLocaleLowerCase() === (b ?? '').trim().toLocaleLowerCase()

const yes = (v?: string) => /^(yes|1|true|evet|var)$/i.test((v ?? '').trim())

export function formatPrice(v?: string): string {
  const n = (v ?? '').trim()
  if (!n) return ''
  return /^\d/.test(n) ? `₺${n}` : n
}

// Convert a DMS coordinate string such as "40°11′02″K 29°03′43″D" to decimal
// degrees. Supports both Turkish (K/G/D/B) and English (N/S/E/W) hemispheres.
export function parseDms(input?: string): { lat: number; lng: number } | null {
  if (!input) return null
  const re =
    /(\d+(?:[.,]\d+)?)\s*°\s*(\d+(?:[.,]\d+)?)?\s*[′']?\s*(\d+(?:[.,]\d+)?)?\s*[″"]?\s*([KGDBNSEWkgdbnsew])/g
  const parts: { val: number; dir: string }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(input)) !== null) {
    const deg = parseFloat(m[1].replace(',', '.'))
    const min = m[2] ? parseFloat(m[2].replace(',', '.')) : 0
    const sec = m[3] ? parseFloat(m[3].replace(',', '.')) : 0
    let val = deg + min / 60 + sec / 3600
    const dir = m[4].toUpperCase()
    if (dir === 'G' || dir === 'S' || dir === 'B' || dir === 'W') val = -val
    parts.push({ val, dir })
  }
  if (parts.length < 2) return null
  const latPart = parts.find((p) => 'KGNS'.includes(p.dir))
  const lngPart = parts.find((p) => 'DBEW'.includes(p.dir))
  if (latPart && lngPart) return { lat: latPart.val, lng: lngPart.val }
  return { lat: parts[0].val, lng: parts[1].val }
}

// Derive a friendly affiliate label from a booking / ticket URL.
export function linkLabel(url?: string): string {
  if (!url) return 'Open'
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const map: Record<string, string> = {
      obilet: 'Obilet',
      flixbus: 'FlixBus',
      booking: 'Booking.com',
      hostelworld: 'Hostelworld',
      airbnb: 'Airbnb',
      skyscanner: 'Skyscanner',
      trip: 'Trip.com',
      tcdd: 'TCDD',
    }
    for (const key in map) if (host.includes(key)) return map[key]
    const root = host.split('.')[0]
    return root.charAt(0).toUpperCase() + root.slice(1)
  } catch {
    return 'Open'
  }
}

/* -------------------------------- types --------------------------------- */

export type TabId = 'arrival' | 'transit' | 'pois' | 'stay' | 'food'

export type Country = { id: string; name: string }
export type City = { id: string; country: string; name: string; desc: string }

export type Arrival = {
  id: string
  type: string // air | bus | train
  name: string
  desc: string
  link: string
  note: string
}

export type Pass = { name: string; desc: string; price: string }
export type Transport = {
  id: string
  cardName: string
  cardFee: string
  fare: string
  exceptions: string
  whereToBuy: string
  contactless: boolean
  qr: boolean
  topUp: string
  passes: Pass[]
}

export type Poi = {
  id: string
  name: string
  desc: string
  link: string
  lat: number | null
  lng: number | null
}

export type Stay = { id: string; where: string; desc: string; link: string }

export type Food = {
  id: string
  name: string
  desc: string
  isMeat: boolean
  isSpicy: boolean
  isVegan: boolean
  isVegetarian: boolean
}

export type CityGuide = {
  city: City
  arrivals: Arrival[]
  transport: Transport | null
  pois: Poi[]
  stays: Stay[]
  foods: Food[]
}

/* ------------------------------- getters -------------------------------- */

export async function getCountries(): Promise<Country[]> {
  const rows = await fetchSheet('country')
  const countries = rows.map((r) => ({ id: r.id, name: r.country })).filter((c) => c.name)
  countries.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }),
  )
  return countries
}

export async function getCities(country?: string): Promise<City[]> {
  const rows = await fetchSheet('city')
  let cities = rows
    .map((r) => ({
      id: r.id,
      country: r.country,
      name: r.city,
      desc: r.desc,
    }))
    .filter((c) => c.name)
  if (country) cities = cities.filter((c) => eq(c.country, country))
  cities.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }),
  )
  return cities
}

export async function getCity(
  country: string,
  city: string,
): Promise<City | null> {
  const cities = await getCities(country)
  return cities.find((c) => eq(c.name, city)) ?? null
}

async function getArrivals(city: string): Promise<Arrival[]> {
  const rows = await fetchSheet('tocity')
  return rows
    .filter((r) => eq(r.city, city))
    .map((r) => ({
      id: r.id,
      type: (r.type || '').toLowerCase(),
      name: r.name,
      desc: r.desc,
      link: r.link,
      note: r.put,
    }))
}

async function getTransport(city: string): Promise<Transport | null> {
  const rows = await fetchSheet('transport')
  const r = rows.find((row) => eq(row.city, city))
  if (!r) return null
  const passes: Pass[] = []
  for (let i = 1; i <= 5; i++) {
    const name = r[`pass${i}`]
    if (name)
      passes.push({
        name,
        desc: r[`pass${i}_desc`] || '',
        price: r[`pass${i}_price`] || '',
      })
  }
  return {
    id: r.id,
    cardName: r.card_name,
    cardFee: r.empty_card_fee,
    fare: r.fare,
    exceptions: r.exceptions,
    whereToBuy: r.where_to_buy,
    contactless: yes(r.contactless),
    qr: yes(r.qr),
    topUp: r['top-up'],
    passes,
  }
}

async function getPois(city: string): Promise<Poi[]> {
  const rows = await fetchSheet('poi')
  return rows
    .filter((r) => eq(r.city, city))
    .map((r) => {
      const coords = parseDms(r.location)
      return {
        id: r.id,
        name: r.name,
        desc: r.disc,
        link: r.link,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      }
    })
}

async function getStays(): Promise<Stay[]> {
  const rows = await fetchSheet('stay')
  return rows
    .map((r) => ({ id: r.id, where: r.where, desc: r.desc, link: r.link }))
    .filter((s) => s.where)
}

async function getFoods(city: string): Promise<Food[]> {
  const rows = await fetchSheet('food')
  return rows
    .filter((r) => eq(r.city, city))
    .map((r) => ({
      id: r.id,
      name: r.food_name,
      desc: r.food_desc,
      isMeat: yes(r.is_meat),
      isSpicy: yes(r.is_spicy),
      isVegan: yes(r.is_vegan),
      isVegetarian: yes(r.is_vegetarian),
    }))
}

export async function getCityGuide(
  country: string,
  city: string,
): Promise<CityGuide | null> {
  const cityRow = await getCity(country, city)
  if (!cityRow) return null
  const [arrivals, transport, pois, stays, foods] = await Promise.all([
    getArrivals(city),
    getTransport(city),
    getPois(city),
    getStays(),
    getFoods(city),
  ])
  return { city: cityRow, arrivals, transport, pois, stays, foods }
}
