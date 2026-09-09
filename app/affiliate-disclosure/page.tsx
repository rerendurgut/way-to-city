import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DollarSign, Info } from 'lucide-react'

export const metadata = {
  title: 'Affiliate Disclosure | WayToCity',
  description: 'WayToCity transparent FTC and search engine affiliate disclosure statement.',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <header className="border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-3.5" />
              <span>FTC &amp; Search Engine Compliance</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Affiliate Disclosure
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Transparency &amp; Monetization Policy
            </p>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none mt-10 space-y-8 text-foreground/90 text-sm leading-relaxed">
            <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Info className="size-5" />
                Transparent Disclosure Statement
              </h2>
              <p className="mt-3 text-sm text-foreground/90 leading-relaxed font-medium">
                WayToCity is a free, community-supported travel and urban transit guide. Some links on this website (such as eSIM purchases, hotel booking links, or tour reservation links) are affiliate links.
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                If you click through one of these affiliate links and complete a purchase or booking, we may earn a small referral commission at <strong className="text-foreground">absolutely no additional cost to you</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Why We Use Affiliate Links</h2>
              <p>
                Maintaining servers, updating city databases, moderating community submissions, and keeping WayToCity free of intrusive pop-up banner ads requires resources. Affiliate commissions allow us to keep the site 100% free, fast, and accessible to travelers worldwide.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Editorial Integrity</h2>
              <p>
                Our recommendations are independent. We only feature services, eSIM providers, and travel resources that we believe bring genuine value to travelers. Compensation received through affiliate links never dictates our transit guides or fare reporting.
              </p>
            </section>
          </article>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
