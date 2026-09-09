import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, MapPin } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { getCities, getCountries } from '@/lib/sheets'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country: rawCountry } = await params
  const countryName = decodeURIComponent(rawCountry)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'
  const title = `${countryName} Transit Guides, Public Transport Fares & Cities | WayToCity`
  const description = `${countryName} urban transit guide: city transport cards, bus & metro ticket prices, airport transfers, and travel guides.`
  const pageUrl = `${siteUrl}/${encodeURIComponent(rawCountry)}`
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(`${countryName} Transit Guides`)}&subtitle=${encodeURIComponent('Public Transport Fares %26 Cities')}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'WayToCity',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${countryName} Transit Guide`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
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

  const countryObj = countries.find(
    (c) => c.name.toLocaleLowerCase() === country.toLocaleLowerCase(),
  )
  if (!countryObj) notFound()

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
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-accent/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              All destinations
            </Link>

            {countryObj.continent && (
              <Link
                href={`/continent/${encodeURIComponent(countryObj.continent)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                {countryObj.continent}
              </Link>
            )}
          </div>

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
              searchPlaceholder={`Search cities in ${country}...`}
              emptyText={`No cities listed for ${country} yet.`}
            />
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
