import Link from 'next/link'
import { ArrowUpRight, Banknote, CheckCircle2, ChevronLeft, Smartphone } from 'lucide-react'
import type { City, Country } from '@/lib/sheets'

export type HeroStat = { label: string; value: string }

export function CityHero({
  city,
  countryData,
  stats,
  euroRate,
}: {
  city: City
  countryData?: Country | null
  stats: HeroStat[]
  euroRate?: string
}) {
  const currencyDisplay = countryData?.currency
    ? countryData.currencyShort
      ? `${countryData.currency} (${countryData.currencyShort})`
      : countryData.currency
    : countryData?.currencyShort || ''

  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section>
      <Link
        href={`/${encodeURIComponent(city.country)}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        {city.country}
      </Link>

      <div className="mt-6 flex items-center flex-wrap gap-2.5">
        <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          {city.country}
        </span>

        {currencyDisplay && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-accent px-3 py-1 font-mono text-xs font-medium text-foreground">
            {currencyDisplay}
          </span>
        )}

        {euroRate && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Banknote className="size-3.5" />
            {euroRate}
          </span>
        )}

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          Fare verified: {currentMonthYear}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
        {city.name}
      </h1>
      {city.desc && (
        <p className="mt-3 max-w-xl text-base text-pretty leading-relaxed text-muted-foreground/90">
          {city.desc}
        </p>
      )}

      {countryData?.esimLink && (
        <div className="mt-4">
          <a
            href={countryData.esimLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Smartphone className="size-4" />
            Get {city.country} eSIM
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      )}

      {stats.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/60 sm:grid-cols-4 shadow-sm">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-5">
              <dt className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
