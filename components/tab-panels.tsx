'use client'

import dynamic from 'next/dynamic'
import {
  ArrowUpRight,
  Banknote,
  BedDouble,
  Building2,
  CreditCard,
  Flame,
  Home,
  Leaf,
  MapPin,
  Plane,
  QrCode,
  Salad,
  Smartphone,
  TrainFront,
  Bus,
  Car,
  KeyRound,
  Navigation,
  Ticket,
  Utensils,
  Beef,
  type LucideIcon,
} from 'lucide-react'
import {
  formatEuroRate,
  formatPrice,
  linkLabel,
  type Arrival,
  type Country,
  type Food,
  type Poi,
  type Stay,
  type Transport,
} from '@/lib/sheets'
import type { MapPoi } from '@/components/poi-map'

import { SmartAppLink } from '@/components/smart-app-link'

const PoiMap = dynamic(() => import('@/components/poi-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center bg-secondary text-xs text-muted-foreground sm:h-80">
      Loading map…
    </div>
  ),
})

function AffiliateButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      {label}
      <ArrowUpRight className="size-3.5" />
    </a>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      {children}
    </p>
  )
}

/* ---------------------------- 1. Arrival ---------------------------- */

const arrivalIcons: Record<string, LucideIcon> = {
  air: Plane,
  flight: Plane,
  plane: Plane,
  uçak: Plane,
  ucak: Plane,
  bus: Bus,
  otobus: Bus,
  otobüs: Bus,
  coach: Bus,
  train: TrainFront,
  tren: TrainFront,
  rail: TrainFront,
}

const arrivalTitles: Record<string, string> = {
  air: 'By Air',
  flight: 'By Air',
  plane: 'By Air',
  bus: 'By Bus',
  coach: 'By Bus',
  train: 'By Train',
  rail: 'By Train',
}

function titleForArrival(a: Arrival) {
  return arrivalTitles[a.type] ?? `By ${a.type.charAt(0).toUpperCase() + a.type.slice(1)}`
}

export function ArrivalPanel({ arrivals }: { arrivals: Arrival[] }) {
  if (arrivals.length === 0)
    return <EmptyState>No arrival information for this city yet.</EmptyState>

  return (
    <div className="grid gap-3">
      {arrivals.map((method) => {
        const Icon = arrivalIcons[method.type] ?? Plane
        return (
          <article
            key={method.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-emerald-soft text-primary">
                <Icon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {titleForArrival(method)}
                </h3>
                {method.name && (
                  <p className="text-xs text-muted-foreground">{method.name}</p>
                )}
              </div>
            </div>

            {method.desc && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {method.desc}
              </p>
            )}

            {method.note && (
              method.noteLink ? (
                <a
                  href={method.noteLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <MapPin className="size-3.5" />
                  {method.note}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ) : (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <MapPin className="size-3.5" />
                  {method.note}
                </p>
              )
            )}

            {(method.link || method.noteLink) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {method.link && (
                  <AffiliateButton
                    href={method.link}
                    label={linkLabel(method.link)}
                  />
                )}
                {method.noteLink && (
                  <AffiliateButton
                    href={method.noteLink}
                    label={linkLabel(method.noteLink)}
                  />
                )}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

/* ---------------------------- 2. Transit ---------------------------- */

function StatusBadge({
  on,
  icon: Icon,
  label,
}: {
  on: boolean
  icon: LucideIcon
  label: string
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
        on ? 'border-primary/30 bg-emerald-soft' : 'border-border bg-card'
      }`}
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span
        className={`font-mono text-xs ${on ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {on ? 'Accepted' : 'Not yet'}
      </span>
    </div>
  )
}

export function TransitPanel({
  transport,
  countryData,
}: {
  transport: Transport | null
  countryData?: Country | null
}) {
  if (!transport)
    return <EmptyState>No transit card details for this city yet.</EmptyState>

  const currencyShort = countryData?.currencyShort || countryData?.currency || ''

  return (
    <div className="grid gap-3">
      <article className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-emerald-soft text-primary">
            <CreditCard className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {transport.cardName || 'Transit card'}
            </h3>
            <p className="text-xs text-muted-foreground">Local travel card</p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {transport.whereToBuy && (
            <div>
              <dt className="text-xs text-muted-foreground">Where to buy</dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {transport.whereToBuy}
              </dd>
            </div>
          )}
          {transport.cardFee && (
            <div>
              <dt className="text-xs text-muted-foreground">Card cost</dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {formatPrice(transport.cardFee, currencyShort)}
              </dd>
            </div>
          )}
          {transport.mobileApp && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground mb-1">Mobile app</dt>
              <dd className="mt-0.5 text-sm text-foreground">
                <SmartAppLink rawInput={transport.mobileApp} />
              </dd>
            </div>
          )}
          {transport.topUp && (
            <div className={transport.mobileApp ? '' : 'sm:col-span-2'}>
              <dt className="text-xs text-muted-foreground">Top-up</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-foreground">
                {transport.topUp}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <StatusBadge
            on={transport.contactless}
            icon={CreditCard}
            label="Contactless card"
          />
          <StatusBadge on={transport.qr} icon={QrCode} label="QR boarding" />
        </div>
      </article>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h3 className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Ticket className="size-4 text-primary" />
            Fares &amp; passes
          </h3>
        </div>
        <div className="divide-y divide-border">
          {transport.fare && (
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-sm text-foreground">Single fare</p>
                {transport.exceptions && (
                  <p className="text-xs text-muted-foreground">
                    {transport.exceptions}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-mono text-sm font-medium text-foreground">
                {formatPrice(transport.fare, currencyShort)}
              </span>
            </div>
          )}
          {transport.passes.map((pass) => (
            <div
              key={pass.name}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div>
                <p className="text-sm text-foreground">{pass.name}</p>
                {pass.desc && (
                  <p className="text-xs text-muted-foreground">{pass.desc}</p>
                )}
              </div>
              {pass.price && (
                <span className="shrink-0 font-mono text-sm font-medium text-foreground">
                  {formatPrice(pass.price, currencyShort)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {(transport.taxiApp || transport.carShareApp || transport.carRental) && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Car className="size-4 text-primary" />
              Taxi, Car Sharing &amp; Rentals
            </h3>
          </div>
          <div className="p-5 grid gap-4 sm:grid-cols-3">
            {transport.taxiApp && (
              <div>
                <dt className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                  <Car className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Taxi app
                </dt>
                <dd className="text-sm text-foreground">
                  <SmartAppLink rawInput={transport.taxiApp} />
                </dd>
              </div>
            )}
            {transport.carShareApp && (
              <div>
                <dt className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                  <Navigation className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Car sharing
                </dt>
                <dd className="text-sm text-foreground">
                  <SmartAppLink rawInput={transport.carShareApp} />
                </dd>
              </div>
            )}
            {transport.carRental && (
              <div>
                <dt className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Car rental
                </dt>
                <dd className="text-sm text-foreground">
                  <SmartAppLink rawInput={transport.carRental} />
                </dd>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------ 3. POIs ----------------------------- */

export function PoisPanel({ pois }: { pois: Poi[] }) {
  if (pois.length === 0)
    return <EmptyState>No places listed for this city yet.</EmptyState>

  const mapPois: MapPoi[] = pois
    .filter((p): p is Poi & { lat: number; lng: number } => p.lat !== null && p.lng !== null)
    .map((p) => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng }))

  return (
    <div>
      {mapPois.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <PoiMap pois={mapPois} />
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {pois.map((poi) => (
          <article
            key={poi.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-foreground">
                {poi.name}
              </h3>
              {poi.lat !== null && poi.lng !== null && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-soft px-2 py-1 font-mono text-xs text-primary">
                  <MapPin className="size-3" />
                  On map
                </span>
              )}
            </div>
            {poi.desc && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {poi.desc}
              </p>
            )}
            {poi.link && (
              <a
                href={poi.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-primary"
              >
                More info
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ 4. Stay ----------------------------- */

function stayIcon(where: string): LucideIcon {
  const w = where.toLocaleLowerCase()
  if (w.includes('hostel')) return BedDouble
  if (w.includes('apart') || w.includes('daire') || w.includes('flat'))
    return Home
  return Building2
}

export function StayPanel({ stays }: { stays: Stay[] }) {
  if (stays.length === 0)
    return <EmptyState>No stay options listed yet.</EmptyState>

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stays.map((stay) => {
        const Icon = stayIcon(stay.where)
        return (
          <article
            key={stay.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Icon className="size-4 text-primary" />
              {stay.where}
            </span>
            {stay.desc && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {stay.desc}
              </p>
            )}
            {stay.link && (
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <AffiliateButton
                  href={stay.link}
                  label={linkLabel(stay.link)}
                />
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

/* ------------------------------ 5. Food ----------------------------- */

const dietBadges: {
  key: keyof Pick<Food, 'isMeat' | 'isSpicy' | 'isVegan' | 'isVegetarian'>
  label: string
  icon: LucideIcon
  colorClass: string
}[] = [
  {
    key: 'isMeat',
    label: 'Meat',
    icon: Beef,
    colorClass:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  {
    key: 'isSpicy',
    label: 'Spicy',
    icon: Flame,
    colorClass:
      'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  {
    key: 'isVegetarian',
    label: 'Vegetarian',
    icon: Salad,
    colorClass:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    key: 'isVegan',
    label: 'Vegan',
    icon: Leaf,
    colorClass:
      'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  },
]

export function FoodPanel({ foods }: { foods: Food[] }) {
  if (foods.length === 0)
    return <EmptyState>No local dishes listed for this city yet.</EmptyState>

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        Curated local picks — no ads, no affiliate links.
      </p>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {foods.map((item) => (
          <article
            key={item.id}
            className="flex items-start gap-4 p-5 transition-colors hover:bg-secondary/60"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground">
              <Utensils className="size-4" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">
                {item.name}
              </h3>
              {item.desc && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {dietBadges
                  .filter((b) => item[b.key])
                  .map((b) => {
                    const Icon = b.icon
                    return (
                      <span
                        key={b.key}
                        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${b.colorClass}`}
                      >
                        <Icon className="size-3" />
                        {b.label}
                      </span>
                    )
                  })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
