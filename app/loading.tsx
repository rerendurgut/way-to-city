import { SiteHeader } from '@/components/site-header'

export default function HomeLoading() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
          {/* Hero Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-44 rounded-full bg-muted animate-shimmer" />
            <div className="h-14 w-3/4 max-w-xl rounded-2xl bg-muted animate-shimmer" />
            <div className="h-5 w-full max-w-lg rounded-lg bg-muted/70 animate-shimmer" />
          </div>

          {/* Slider Skeleton */}
          <div className="mt-14 sm:mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 rounded-lg bg-muted animate-shimmer" />
              <div className="h-6 w-20 rounded-full bg-muted animate-shimmer" />
            </div>

            <div className="flex gap-4 overflow-hidden py-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[260px] h-[160px] rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-muted animate-shimmer shrink-0" />
                    <div className="h-5 w-28 rounded-md bg-muted animate-shimmer" />
                  </div>
                  <div className="h-4 w-full rounded-md bg-muted/60 animate-shimmer" />
                  <div className="h-4 w-1/2 rounded-md bg-muted/40 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
