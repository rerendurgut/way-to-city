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

  const cityItems: SlidingMenuItem[] = cities.map((city) => ({
    id: city.id,
    title: city.name,
    subtitle: city.desc,
    href: `/${encodeURIComponent(country)}/${encodeURIComponent(city.name)}`,
    icon: <MapPin className="size-5" />,
    badge: `ID: ${city.id}`,
  }))

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          All countries
        </Link>

        <section className="mt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            {country}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
            Choose a city
          </h1>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Select a city to open its full transit and travel guide.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Cities</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {cities.length} available
            </span>
          </div>

          <SlidingMenu
            items={cityItems}
            variant="card"
            emptyText={`No cities listed for ${country} yet.`}
          />
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>WayToCity — {country}</span>
          <span className="font-mono">Live from Google Sheets</span>
        </div>
      </footer>
    </div>
  )
}
