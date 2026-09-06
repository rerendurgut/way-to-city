import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, MapPin } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { getCities, getCountries } from '@/lib/sheets'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = await params
  const name = decodeURIComponent(country)
  return {
    title: `${name} — WayToCity`,
    description: `Explore cities in ${name}: transit guides, points of interest, food and stays.`,
  }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country: raw } = await params
  const country = decodeURIComponent(raw)

  const [countries, cities] = await Promise.all([
    getCountries(),
    getCities(country),
  ])

  const known = countries.some(
    (c) => c.name.toLocaleLowerCase() === country.toLocaleLowerCase(),
  )
  if (!known) notFound()

  // Cities are sorted by ID in getCities(), but ID is strictly hidden from the UI items
  const cityItems: SlidingMenuItem[] = cities.map((city) => ({
    id: city.id,
    title: city.name,
    subtitle: city.desc || `Complete transit guide & travel tips for ${city.name}`,
    href: `/${encodeURIComponent(country)}/${encodeURIComponent(city.name)}`,
    icon: <MapPin className="size-5" />,
  }))

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-accent/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
            All destinations
          </Link>

          {/* Country Hero Header */}
          <section className="mt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              {country}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Choose a City
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground/90 leading-relaxed">
              Select a city in {country} to open its full transit map, arrival routes, points of interest, local cuisine, and stays.
            </p>
          </section>

          {/* Interactive City Slider */}
          <section className="mt-12 sm:mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Available Cities
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Slide or drag to select a city
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/60">
                {cities.length} cities
              </span>
            </div>

            <SlidingMenu
              items={cityItems}
              variant="card"
              emptyText={`No cities listed for ${country} yet.`}
            />
          </section>
        </main>
      </div>

      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>WayToCity — {country}</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            Live from Google Sheets
          </span>
        </div>
      </footer>
    </div>
  )
}
