import { Globe } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import { getCountries } from '@/lib/sheets'

export const revalidate = 3600

export default async function HomePage() {
  const countries = await getCountries()

  const countryItems: SlidingMenuItem[] = countries.map((country) => ({
    id: country.id,
    title: country.name,
    href: `/${encodeURIComponent(country.name)}`,
    icon: <Globe className="size-5" />,
    badge: `ID: ${country.id}`,
  }))

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <section>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Urban transit &amp; travel
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
            Where are you headed?
          </h1>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Pick a country to explore its cities — how to arrive, get around,
            what to see, where to stay and what to eat.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Countries</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {countries.length} available
            </span>
          </div>

          <SlidingMenu
            items={countryItems}
            variant="card"
            emptyText="No countries found in the database yet."
          />
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>WayToCity — urban transit &amp; travel guide</span>
          <span className="font-mono">Live from Google Sheets</span>
        </div>
      </footer>
    </div>
  )
}
