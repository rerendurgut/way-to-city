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

export function formatPrice(v?: string, currencySymbol?: string): string {
  const n = (v ?? '').trim()
  if (!n) return ''
  if (/[^\d\s.,-]/.test(n)) return n
  const symbol = (currencySymbol ?? '').trim() || '₺'
  return /^[^\w]/u.test(symbol) ? `${symbol}${n}` : `${n} ${symbol}`
}

export function formatEuroRate(rate?: string, currencyShort?: string): string {
  const r = (rate ?? '').trim()
  if (!r || r.startsWith('=')) return ''
  const symbol = (currencyShort ?? '').trim()

  if (r.includes('/')) {
    const parts = r.split('/')
    const denominator = parts[1]?.trim()
    if (denominator) {
      return symbol ? `1 euro = ${denominator} ${symbol}` : `1 euro = ${denominator}`
    }
  }

  const num = Number(r.replace(',', '.'))
  if (!isNaN(num) && num > 0) {
    const valStr = num % 1 === 0 ? String(num) : String(num)
    return symbol ? `1 euro = ${valStr} ${symbol}` : `1 euro = ${valStr}`
  }

  return r
}

export type AppLinkInfo = {
  iosUrl?: string
  androidUrl?: string
  fallbackUrl?: string
  text?: string
}

export function parseAppLinks(input?: string): AppLinkInfo {
  const str = (input ?? '').trim()
  if (!str) return {}

  const parts = str.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)

  let iosUrl: string | undefined
  let androidUrl: string | undefined
  let fallbackUrl: string | undefined
  let text: string | undefined

  for (const part of parts) {
    if (part.startsWith('http://') || part.startsWith('https://')) {
      if (part.includes('apple.com') || part.includes('itunes')) {
        iosUrl = part
      } else if (
        part.includes('play.google.com') ||
        part.includes('google') ||
        part.includes('android')
      ) {
        androidUrl = part
      } else {
        if (!fallbackUrl) fallbackUrl = part
      }
    } else {
      if (!text) text = part
    }
  }

  return { iosUrl, androidUrl, fallbackUrl, text }
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

export type TabId = 'arrival' | 'transit' | 'pois' | 'stay' | 'food' | 'events'

export type EventItem = {
  id: string
  name: string
  desc: string
  eventDate: string
  link: string
  location?: string
  price?: string
}

export type CityGuide = {
  city: City
  countryData: Country | null
  arrivals: Arrival[]
  transport: Transport | null
  pois: Poi[]
  stays: Stay[]
  foods: Food[]
  events: EventItem[]
}

import { supabase } from '@/lib/supabase'

/* ------------------------------- getters -------------------------------- */

export async function getCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase.from('countries').select('*')
    if (!error && data && data.length > 0) {
      const countries = data.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        continent: r.continent || '',
        currency: r.currency || '',
        currencyShort: r.currency_short || '',
        euroConversion: r.euro_conversion || '',
        esimLink: r.esim_link || '',
      }))
      countries.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }),
      )
      return countries
    }
  } catch (err) {
    console.error('Supabase getCountries error, falling back to sheet:', err)
  }

  const rows = await fetchSheet('country')
  const countries = rows
    .map((r) => ({
      id: r.id,
      name: r.country,
      continent: r.continent || r.kita || '',
      currency: r.currency || '',
      currencyShort: r.currency_short || r.currency_code || r.currency_symbol || '',
      euroConversion:
        r.euro_conversion || r.euro_rate || r.eur_conversion || '',
      esimLink:
        r.e_sim ||
        r.e_sim_link ||
        r['e-sim'] ||
        r['e-sim-link'] ||
        r.esim_link ||
        r.esim ||
        r.esim_url ||
        r.esim_linki ||
        r.esim_button ||
        r.esim_href ||
        '',
    }))
    .filter((c) => c.name)
  countries.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }),
  )
  return countries
}

export async function getContinents(): Promise<string[]> {
  const countries = await getCountries()
  const set = new Set<string>()
  for (const c of countries) {
    if (c.continent) set.add(c.continent)
  }
  return Array.from(set).sort()
}

export async function getCountriesByContinent(
  continentName: string,
): Promise<Country[]> {
  const countries = await getCountries()
  return countries.filter(
    (c) => (c.continent || '').toLocaleLowerCase() === continentName.toLocaleLowerCase(),
  )
}

export async function getCountry(
  countryName: string,
): Promise<Country | null> {
  const countries = await getCountries()
  return (
    countries.find(
      (c) => c.name.toLocaleLowerCase() === countryName.toLocaleLowerCase(),
    ) ?? null
  )
}

export async function getCities(country?: string): Promise<City[]> {
  try {
    let query = supabase.from('cities').select('*')
    if (country) {
      query = query.ilike('country', country)
    }
    const { data, error } = await query
    if (!error && data && data.length > 0) {
      const cities = data.map((r: any) => ({
        id: String(r.id),
        country: r.country,
        name: r.name,
        desc: r.desc || '',
      }))
      cities.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }),
      )
      return cities
    }
  } catch (err) {
    console.error('Supabase getCities error, falling back to sheet:', err)
  }

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

export async function getArrivals(city: string): Promise<Arrival[]> {
  try {
    const { data, error } = await supabase
      .from('tocity')
      .select('*')
      .ilike('city', city)
      .eq('status', 'approved')
    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: String(r.id),
        type: (r.type || '').toLowerCase(),
        name: r.name || '',
        desc: r.desc || '',
        link: r.link || '',
        note: r.note || '',
        noteLink: r.note_link || '',
      }))
    }
  } catch (err) {
    console.error('Supabase getArrivals error:', err)
  }

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
      noteLink: r.put_link || r.note_link || r.putlink || r.put_url || '',
    }))
}

export async function getTransport(city: string): Promise<Transport | null> {
  try {
    const { data, error } = await supabase
      .from('transport')
      .select('*')
      .ilike('city', city)
      .limit(1)
    if (!error && data && data.length > 0) {
      const r = data[0]
      return {
        id: String(r.id),
        cardName: r.card_name || '',
        cardFee: r.card_fee || '',
        fare: r.fare || '',
        exceptions: r.exceptions || '',
        whereToBuy: r.where_to_buy || '',
        mobileApp: r.mobile_app || '',
        taxiApp: r.taxi_app || '',
        carShareApp: r.car_share_app || '',
        carRental: r.car_rental || '',
        contactless: Boolean(r.contactless),
        qr: Boolean(r.qr),
        topUp: r.top_up || '',
        passes: Array.isArray(r.passes) ? r.passes : [],
      }
    }
  } catch (err) {
    console.error('Supabase getTransport error:', err)
  }

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
    mobileApp:
      r.mobile_app ||
      r.mobile_app_link ||
      r.app_link ||
      r.app ||
      r.mobil_uygulama ||
      '',
    taxiApp:
      r.taxi_app ||
      r.taxi ||
      r.taksi ||
      r.taxi_app_link ||
      r.taksi_uygulamasi ||
      '',
    carShareApp:
      r.car_share_app ||
      r.car_share ||
      r.carshare ||
      r.car_sharing ||
      r.arac_paylasim ||
      '',
    carRental:
      r.car_rental ||
      r.car_rental_app ||
      r.car_rental_link ||
      r.arac_kiralama ||
      r.rent_a_car ||
      '',
    contactless: yes(r.contactless),
    qr: yes(r.qr),
    topUp: r['top-up'],
    passes,
  }
}

export async function getPois(city: string): Promise<Poi[]> {
  try {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .ilike('city', city)
      .eq('status', 'approved')
    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: String(r.id),
        name: r.name || '',
        desc: r.desc || '',
        link: r.link || '',
        lat: r.lat ?? null,
        lng: r.lng ?? null,
      }))
    }
  } catch (err) {
    console.error('Supabase getPois error:', err)
  }

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

export async function getStays(city: string): Promise<Stay[]> {
  try {
    const { data, error } = await supabase
      .from('stays')
      .select('*')
      .ilike('city', city)
      .eq('status', 'approved')
    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: String(r.id),
        city: r.city,
        where: r.where_stay || r.where || '',
        desc: r.desc || '',
        link: r.link || '',
      }))
    }
  } catch (err) {
    console.error('Supabase getStays error:', err)
  }

  const rows = await fetchSheet('stay')
  return rows
    .filter((r) => !r.city || eq(r.city, city))
    .map((r) => ({
      id: r.id,
      city: r.city,
      where: r.where,
      desc: r.desc,
      link: r.link,
    }))
    .filter((s) => s.where)
}

export async function getFoods(city: string): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('city', city)
      .eq('status', 'approved')
    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: String(r.id),
        name: r.name || '',
        desc: r.desc || '',
        isMeat: Boolean(r.is_meat),
        isSpicy: Boolean(r.is_spicy),
        isVegan: Boolean(r.is_vegan),
        isVegetarian: Boolean(r.is_vegetarian),
      }))
    }
  } catch (err) {
    console.error('Supabase getFoods error:', err)
  }

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

export async function getEvents(city: string): Promise<EventItem[]> {
  const todayStr = new Date().toISOString().split('T')[0]

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('city', city)
      .gte('event_date', todayStr)
      .order('event_date', { ascending: true })

    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: String(r.id),
        name: r.name || '',
        desc: r.desc || '',
        eventDate: r.event_date || '',
        link: r.link || '',
        location: r.location || '',
        price: r.price || '',
      }))
    }
  } catch (err) {
    console.error('Supabase getEvents error:', err)
  }

  try {
    const rows = await fetchSheet('events' as any)
    return rows
      .filter((r) => eq(r.city, city))
      .map((r) => ({
        id: r.id,
        name: r.event_name || r.name || '',
        desc: r.event_desc || r.desc || '',
        eventDate: r.event_date || r.date || '',
        link: r.link || '',
        location: r.location || '',
        price: r.price || '',
      }))
      .filter((e) => !e.eventDate || e.eventDate >= todayStr)
      .sort((a, b) => (a.eventDate || '').localeCompare(b.eventDate || ''))
  } catch {
    return []
  }
}

export async function getCityGuide(
  country: string,
  city: string,
): Promise<CityGuide | null> {
  const cityRow = await getCity(country, city)
  if (!cityRow) return null
  const [countryData, arrivals, transport, pois, stays, foods, events] =
    await Promise.all([
      getCountry(country),
      getArrivals(city),
      getTransport(city),
      getPois(city),
      getStays(city),
      getFoods(city),
      getEvents(city),
    ])
  return {
    city: cityRow,
    countryData,
    arrivals,
    transport,
    pois,
    stays,
    foods,
    events,
  }
}
