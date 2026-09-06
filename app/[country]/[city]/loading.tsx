import { SiteHeader } from '@/components/site-header'

export default function CityDetailLoading() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
          {/* Quick Switcher Skeleton */}
          <div className="mb-8 border-b border-border/60 pb-5 space-y-3">
            <div className="h-4 w-32 rounded-md bg-muted animate-shimmer" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-28 rounded-full bg-muted animate-shimmer shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Hero & Stats Skeleton */}
          <div className="space-y-4">
            <div className="h-12 w-72 rounded-2xl bg-muted animate-shimmer" />
            <div className="h-5 w-full max-w-lg rounded-lg bg-muted/70 animate-shimmer" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl border border-border/60 bg-card p-4 space-y-2"
                >
                  <div className="h-3 w-16 rounded bg-muted animate-shimmer" />
                  <div className="h-6 w-10 rounded bg-muted animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
