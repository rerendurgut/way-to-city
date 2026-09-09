import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { CityHero, type HeroStat } from '@/components/city-hero'
import { GuideTabs } from '@/components/guide-tabs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { CityJsonLd } from '@/components/json-ld'
import {
  formatEuroRate,
  formatPrice,
  getCities,
  getCityGuide,
} from '@/lib/sheets'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>
}) {
  const { country: rawCountry, city: rawCity } = await params
  const countryName = decodeURIComponent(rawCountry)
  const cityName = decodeURIComponent(rawCity)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'
  const title = `${cityName} Transit Guide: Public Transport Fares, Cards & Things to Do | WayToCity`
  const description = `Complete ${cityName} (${countryName}) urban transit guide: bus & metro ticket prices, ${cityName} transit card, airport transfers, and top sights.`
  const pageUrl = `${siteUrl}/${encodeURIComponent(rawCountry)}/${encodeURIComponent(rawCity)}`
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(`${cityName} Transit Guide`)}&subtitle=${encodeURIComponent(`${countryName} Public Transport Fares %26 Sights`)}`

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
          alt: `${cityName} Transit Guide`,
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

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>
}) {
  const { country: rawCountry, city: rawCity } = await params
  const country = decodeURIComponent(rawCountry)
  const city = decodeURIComponent(rawCity)

  const [guide, allCities] = await Promise.all([
    getCityGuide(country, city),
    getCities(country),
  ])

  if (!guide) notFound()

  // Cities are sorted by ID behind the scenes, but ID is strictly hidden from the UI items
  const cityPillItems: SlidingMenuItem[] = allCities.map((c) => ({
    id: c.id,
    title: c.name,
    href: `/${encodeURIComponent(country)}/${encodeURIComponent(c.name)}`,
    icon: <MapPin className="size-3.5" />,
    isActive: c.name.toLocaleLowerCase() === city.toLocaleLowerCase(),
  }))

  const currencyShort = guide.countryData?.currencyShort || ''
  const euroRateFormatted = formatEuroRate(
    guide.countryData?.euroConversion,
    currencyShort,
  )

  const stats: HeroStat[] = []
  if (guide.arrivals.length)
    stats.push({ label: 'Arrival routes', value: String(guide.arrivals.length) })
  if (guide.transport?.fare)
    stats.push({
      label: 'Single fare',
      value: formatPrice(guide.transport.fare, currencyShort),
    })
  if (guide.pois.length)
    stats.push({ label: 'Places to see', value: String(guide.pois.length) })
  if (guide.foods.length)
    stats.push({ label: 'Local dishes', value: String(guide.foods.length) })

  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <CityJsonLd guide={guide} />
      <div>
        <SiteHeader country={country} city={guide.city.name} />

        <main className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
          {allCities.length > 1 && (
            <div className="mb-8 border-b border-border/60 pb-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Cities in {country}
                </span>
              </div>
              <SlidingMenu
                items={cityPillItems}
                variant="pill"
                showSearch={false}
              />
            </div>
          )}

          <CityHero
            city={guide.city}
            countryData={guide.countryData}
            stats={stats}
            euroRate={euroRateFormatted}
          />
          <GuideTabs guide={guide} />
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
