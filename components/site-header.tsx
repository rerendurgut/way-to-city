import { Navigation } from 'lucide-react'
import { ContributeDialog } from '@/components/contribute-dialog'

export function SiteHeader() {
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
          <ContributeDialog />
        </div>
      </div>
    </header>
  )
}
