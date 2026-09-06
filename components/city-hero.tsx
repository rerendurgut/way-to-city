import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { City } from '@/lib/sheets'

export type HeroStat = { label: string; value: string }

export function CityHero({
  city,
  stats,
}: {
  city: City
  stats: HeroStat[]
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

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-widest text-primary">
          {city.country}
        </span>
      </div>

      <h1 className="mt-3 text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl">
        {city.name}
      </h1>
      {city.desc && (
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {city.desc}
        </p>
      )}

      {stats.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-4">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 font-mono text-2xl text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
