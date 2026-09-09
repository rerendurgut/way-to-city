import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Globe } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { getCountriesByContinent, getContinents } from '@/lib/sheets'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string }>
}) {
  const { continent: rawContinent } = await params
  const continentName = decodeURIComponent(rawContinent)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'
  const title = `${continentName} Urban Transit Guides & City Travel Guides | WayToCity`
  const description = `Explore cities across ${continentName}: public transit cards, bus & metro ticket prices, airport transfer routes, and top travel spots.`
  const pageUrl = `${siteUrl}/continent/${encodeURIComponent(rawContinent)}`
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(`${continentName} Transit Guides`)}&subtitle=${encodeURIComponent('Urban Transit %26 Travel Guides')}`

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
          alt: `${continentName} Transit Guide`,
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

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ continent: string }>
}) {
  const { continent: rawContinent } = await params
  const continent = decodeURIComponent(rawContinent)

  const countries = await getCountriesByContinent(continent)
  if (countries.length === 0) notFound()

  const countryItems: SlidingMenuItem[] = countries.map((country) => ({
    id: country.id,
    title: country.name,
    subtitle: `Explore transit routes, attractions & local tips in ${country.name}`,
    href: `/${encodeURIComponent(country.name)}`,
    icon: <Globe className="size-5" />,
  }))

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground mb-6"
          >
            <ChevronLeft className="size-3.5" />
            All Continents
          </Link>

          <header className="mb-10">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Continent
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {continent}
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Select a country in {continent} to view transit cards, arrival routes, food spots, and stays.
            </p>
          </header>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Countries in {continent}
              </h2>
              <span className="font-mono text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/60">
                {countries.length} countries
              </span>
            </div>

            <SlidingMenu
              items={countryItems}
              variant="card"
              searchPlaceholder={`Search ${continent} countries...`}
              emptyText={`No countries found in ${continent}.`}
            />
          </section>
        </main>
      </div>

      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>WayToCity — {continent}</span>
        </div>
      </footer>
    </div>
  )
}
