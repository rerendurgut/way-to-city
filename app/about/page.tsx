import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Compass, Users, ShieldCheck, Heart } from 'lucide-react'

export const metadata = {
  title: 'About Us | WayToCity',
  description: 'Learn about WayToCity, our mission to simplify urban transit worldwide, and how our community collects accurate, real-time fare data.',
}

export default function AboutPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <header className="border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Compass className="size-3.5 animate-spin-slow" />
              <span>Our Story &amp; Mission</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              About WayToCity
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              Navigating a new city should be effortless. We make urban transit, ticket prices, and travel logistics crystal clear.
            </p>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none mt-10 space-y-8 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Users className="size-6 text-emerald-600" />
                Who We Are
              </h2>
              <p>
                WayToCity is a community-driven project created by avid travelers and urban logistics enthusiasts. We built WayToCity to solve a universal pain point: stepping off a plane or train in a new city and scrambling to figure out which transit card to buy, how much a single bus ticket costs, or the best route to the city center.
              </p>
              <p>
                Rather than forcing you to wade through outdated forum posts or fragmented municipal websites, WayToCity consolidates public transport card rates, single fare prices, airport arrival routes, authentic local food spots, and curated stays into one ultra-minimalist, distraction-free dashboard.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldCheck className="size-6 text-emerald-600" />
                How We Verify Transit Data
              </h2>
              <p>
                Urban transport authorities adjust fares and card policies regularly. To ensure maximum accuracy, WayToCity relies on a hybrid verification system:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Official Feeds &amp; Tariffs:</strong> We audit official city transit websites and regional transport authority press releases.
                </li>
                <li>
                  <strong className="text-foreground">Community Contributions:</strong> Local residents and fellow travelers submit real-time updates and fare corrections through our open contribution form.
                </li>
                <li>
                  <strong className="text-foreground">Manual Moderation:</strong> Every user submission is reviewed and verified by our editorial team before publication.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Heart className="size-6 text-emerald-600" />
                Our Promise
              </h2>
              <p>
                We believe travel information should remain free, fast, and accessible to everyone. WayToCity will always remain ad-light, mobile-optimized, and free of paywalls.
              </p>
            </section>
          </article>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
