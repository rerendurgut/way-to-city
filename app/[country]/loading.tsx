import { SiteHeader } from '@/components/site-header'

export default function CountryLoading() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
          <div className="h-7 w-32 rounded-full bg-muted animate-shimmer" />

          {/* Header Skeleton */}
          <div className="mt-6 space-y-3">
            <div className="h-4 w-20 rounded-md bg-muted animate-shimmer" />
            <div className="h-12 w-64 rounded-2xl bg-muted animate-shimmer" />
            <div className="h-5 w-full max-w-md rounded-lg bg-muted/70 animate-shimmer" />
          </div>

          {/* Cities Slider Skeleton */}
          <div className="mt-12 sm:mt-14 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-36 rounded-lg bg-muted animate-shimmer" />
              <div className="h-6 w-16 rounded-full bg-muted animate-shimmer" />
            </div>

            <div className="flex gap-4 overflow-hidden py-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="min-w-[260px] h-[160px] rounded-2xl border border-border/60 bg-card p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-muted animate-shimmer shrink-0" />
                    <div className="h-5 w-32 rounded-md bg-muted animate-shimmer" />
                  </div>
                  <div className="h-4 w-full rounded-md bg-muted/60 animate-shimmer" />
                  <div className="h-4 w-2/3 rounded-md bg-muted/40 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
