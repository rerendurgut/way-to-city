import { Compass, Globe } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { getCountries } from '@/lib/sheets'

export const revalidate = 60

export default async function HomePage() {
  const countries = await getCountries()

  // Countries are sorted by ID in getCountries(), but ID is strictly hidden from the UI items
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

        <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
          {/* Modernized Hero Section */}
          <section className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
              <Compass className="size-3.5 animate-spin-slow" />
              <span>Urban transit &amp; travel guide</span>
            </div>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl text-foreground">
              Where are you headed?
            </h1>

            <p className="mt-4 max-w-2xl text-base sm:text-lg text-pretty leading-relaxed text-muted-foreground/90">
              Pick a country to explore its cities — from airport arrivals and local transit cards to top landmarks, authentic dishes, and curated stays.
            </p>
          </section>

          {/* Interactive Country Selection Slider */}
          <section className="mt-14 sm:mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Choose a Destination
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a country from the interactive slider below
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/60">
                {countries.length} countries
              </span>
            </div>

            <SlidingMenu
              items={countryItems}
              variant="card"
              emptyText="No countries available in the database right now."
            />
          </section>
        </main>
      </div>

      <footer className="border-t border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>WayToCity — urban transit &amp; travel guide</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            Live from Google Sheets
          </span>
        </div>
      </footer>
    </div>
  )
}
