'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, MapPin, Calendar, Search, ArrowRight } from 'lucide-react'
import { SlidingMenu, type SlidingMenuItem } from '@/components/sliding-menu'
import type { Country, GlobalEventItem } from '@/lib/sheets'

export function ContinentSelector({
  countries,
  events = [],
}: {
  countries: Country[]
  events?: GlobalEventItem[]
}) {
  const [selectedContinent, setSelectedContinent] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Extract unique continents from countries list
  const continents = Array.from(
    new Set(countries.map((c) => c.continent).filter(Boolean)),
  ).sort()

  const query = searchQuery.trim().toLowerCase()

  // 1. Filter Countries by continent & search query
  const filteredCountries = countries.filter((c) => {
    const matchesContinent =
      selectedContinent === 'All' ||
      (c.continent || '').toLocaleLowerCase() === selectedContinent.toLocaleLowerCase()

    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.continent || '').toLowerCase().includes(query)

    return matchesContinent && matchesSearch
  })

  // 2. Filter Events by continent & search query
  const filteredEvents = events.filter((evt) => {
    const matchesContinent =
      selectedContinent === 'All' ||
      !evt.continent ||
      evt.continent.toLocaleLowerCase() === selectedContinent.toLocaleLowerCase()

    const matchesSearch =
      !query ||
      evt.name.toLowerCase().includes(query) ||
      (evt.desc || '').toLowerCase().includes(query) ||
      evt.city.toLowerCase().includes(query) ||
      evt.country.toLowerCase().includes(query) ||
      (evt.location || '').toLowerCase().includes(query) ||
      (evt.continent || '').toLowerCase().includes(query)

    return matchesContinent && matchesSearch
  })

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
    <div className="space-y-10">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search countries, cities, or upcoming events (e.g. Turkey, Bursa, Jazz Fest)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-card pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm"
          />
        </div>

        {/* Continent Filter Tabs */}
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
                (c) =>
                  (c.continent || '').toLocaleLowerCase() ===
                  continent.toLocaleLowerCase(),
              ).length
              const isSelected =
                selectedContinent.toLocaleLowerCase() ===
                continent.toLocaleLowerCase()

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
      </div>

      {/* Interactive Country Selection Slider */}
      <div className="space-y-4">
        <SlidingMenu
          items={countryItems}
          variant="card"
          searchPlaceholder={`Filter countries...`}
          emptyText={
            selectedContinent === 'All'
              ? 'No countries matching your search.'
              : `No countries found in ${selectedContinent}.`
          }
        />
      </div>

      {/* Upcoming Events Section */}
      <section className="space-y-5 pt-8 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-amber-500" />
              Upcoming Events &amp; Festivals
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live concerts, cultural events, and festivals across cities
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/60">
            {filteredEvents.length} upcoming
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-xs text-muted-foreground italic">
            No upcoming events found matching your search. Be the first to suggest one in the city guide!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/${encodeURIComponent(evt.country)}/${encodeURIComponent(evt.city)}?tab=events`}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-1 flex-wrap text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <MapPin className="size-3" />
                      {evt.city}, {evt.country}
                    </span>
                    {evt.eventDate && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-mono font-bold text-amber-700 dark:text-amber-300">
                        <Calendar className="size-3" />
                        {evt.eventDate}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {evt.name}
                  </h4>

                  {evt.location && (
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                      📍 {evt.location}
                    </p>
                  )}

                  {evt.desc && (
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                      {evt.desc}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                  <span>Explore City &amp; Events</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
