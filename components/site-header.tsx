import { Navigation, Search } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary">
            <Navigation className="size-4 text-primary-foreground" />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            WayToCity
          </span>
        </a>

        <nav className="flex items-center gap-1 text-sm">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Search the guide"
          >
            <Search className="size-4" />
          </button>
        </nav>
      </div>
    </header>
  )
}
