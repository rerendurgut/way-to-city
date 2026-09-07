'use client'

import { useState } from 'react'
import { Globe, MapPin } from 'lucide-react'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import type { Country } from '@/lib/sheets'

export function ContinentSelector({ countries }: { countries: Country[] }) {
  const [selectedContinent, setSelectedContinent] = useState<string>('All')

  // Extract unique continents from countries list
  const continents = Array.from(
    new Set(countries.map((c) => c.continent).filter(Boolean)),
  ).sort()

  const filteredCountries =
    selectedContinent === 'All'
      ? countries
      : countries.filter(
          (c) =>
            (c.continent || '').toLocaleLowerCase() ===
            selectedContinent.toLocaleLowerCase(),
        )

  const countryItems: SlidingMenuItem[] = filteredCountries.map((country) => ({
    id: country.id,
    title: country.name,
    subtitle: country.continent
      ? `${country.continent} • Explore transit & travel guide`
      : `Explore transit & travel guide`,
    href: `/${encodeURIComponent(country.name)}`,
    icon: <Globe className="size-5" />,
  }))

  return (
    <div className="space-y-6">
      {/* Continent Tabs */}
      {continents.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedContinent('All')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedContinent === 'All'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground border border-border/60'
            }`}
          >
            <Globe className="size-3.5" />
            All Continents ({countries.length})
          </button>

          {continents.map((continent) => {
            const count = countries.filter(
              (c) => (c.continent || '').toLocaleLowerCase() === continent.toLocaleLowerCase(),
            ).length
            const isSelected =
              selectedContinent.toLocaleLowerCase() === continent.toLocaleLowerCase()

            return (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground border border-border/60'
                }`}
              >
                <MapPin className="size-3.5" />
                {continent} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Interactive Country Selection Slider */}
      <SlidingMenu
        items={countryItems}
        variant="card"
        searchPlaceholder={`Search ${selectedContinent === 'All' ? 'all' : selectedContinent} countries...`}
        emptyText={
          selectedContinent === 'All'
            ? 'No countries available right now.'
            : `No countries found in ${selectedContinent}.`
        }
      />
    </div>
  )
}
