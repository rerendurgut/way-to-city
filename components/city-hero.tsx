import Link from 'next/link'
import { Banknote, ChevronLeft } from 'lucide-react'
import type { City } from '@/lib/sheets'

export type HeroStat = { label: string; value: string }

export function CityHero({
  city,
  stats,
  euroRate,
  currency,
}: {
  city: City
  stats: HeroStat[]
  euroRate?: string
  currency?: string
}) {
  return (
    <section>
      <Link
        href={`/${encodeURIComponent(city.country)}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        {city.country}
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          {city.country}
        </span>

        {currency && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-accent px-2.5 py-0.5 font-mono text-xs font-medium text-foreground">
            {currency}
          </span>
        )}

        {euroRate && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Banknote className="size-3.5" />
            {euroRate}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
        {city.name}
      </h1>
      {city.desc && (
        <p className="mt-3 max-w-xl text-base text-pretty leading-relaxed text-muted-foreground/90">
          {city.desc}
        </p>
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
