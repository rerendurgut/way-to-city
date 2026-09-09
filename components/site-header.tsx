'use client'

import { Navigation, PlusCircle, Twitter, Instagram } from 'lucide-react'
import { useContributeModal } from '@/components/contribute-provider'

export function SiteHeader({ country, city }: { country?: string; city?: string }) {
  const { openContribute } = useContributeModal()

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Navigation className="size-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-emerald-600 transition-colors">
            WayToCity
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            <a
              href="https://x.com/waytocity"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WayToCity on X (Twitter)"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Twitter className="size-3.5" />
            </a>
            <a
              href="https://instagram.com/waytocity"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WayToCity on Instagram"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Instagram className="size-3.5" />
            </a>
          </div>

          <button
            onClick={() => openContribute({ country, city })}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 shadow-sm"
          >
            <PlusCircle className="size-3.5" />
            Contribute Info
          </button>
        </div>
      </div>
    </header>
  )
}
