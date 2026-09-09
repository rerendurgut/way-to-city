import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FileText, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service & Disclaimer | WayToCity',
  description: 'WayToCity Terms of Service and transit fare accuracy disclaimer.',
}

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <header className="border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FileText className="size-3.5" />
              <span>Terms &amp; Disclaimers</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: September 2026
            </p>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none mt-10 space-y-8 text-foreground/90 text-sm leading-relaxed">
            <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
              <h2 className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Transit Fare &amp; Schedule Disclaimer
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Public transport single fares, transit card prices, airport bus routes, and itineraries listed on WayToCity are provided strictly for general informational purposes. Municipalities, transit operators, and transport authorities may update rates, routes, or timetable policies without prior notice. WayToCity cannot be held liable for discrepancies, unexpected price changes, or travel delays resulting from reliance on listed data. Always verify fares with official local operators before traveling.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using WayToCity (waytocity.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">2. Intellectual Property &amp; Content Use</h2>
              <p>
                All original guides, editorial layouts, code, and curated transit summaries on WayToCity are the property of WayToCity. You may share links to our guides for personal, non-commercial travel planning. Commercial scraping or redistribution of our database without written consent is prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">3. User Contributions</h2>
              <p>
                By submitting transit corrections, fare updates, or city recommendations via our &quot;Contribute Info&quot; tool, you grant WayToCity a non-exclusive, worldwide, royalty-free license to edit, publish, and display the submitted information across our platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">4. Limitation of Liability</h2>
              <p>
                Under no circumstances shall WayToCity, its founders, or contributors be liable for direct, indirect, incidental, or consequential damages arising out of your use of the website or reliance on transit fare details.
              </p>
            </section>
          </article>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
