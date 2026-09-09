import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Mail, MessageSquare, Briefcase, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | WayToCity',
  description: 'Get in touch with the WayToCity team for feedback, press inquiries, partnerships, or data corrections.',
}

export default function ContactPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <header className="border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Mail className="size-3.5" />
              <span>Direct Communication</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              Have a question, feedback, partnership inquiry, or data update? We’d love to hear from you.
            </p>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                  <MessageSquare className="size-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  General &amp; Community Feedback
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  For general inquiries, suggestions, or to report transit fare updates in your city.
                </p>
              </div>
              <a
                href="mailto:hello@waytocity.com"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                hello@waytocity.com &rarr;
              </a>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                  <Briefcase className="size-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Partnerships &amp; Press
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  For media inquiries, affiliate partnerships, transport authority collaborations, or API requests.
                </p>
              </div>
              <a
                href="mailto:partnerships@waytocity.com"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                partnerships@waytocity.com &rarr;
              </a>
            </div>
          </div>

          <section className="mt-12 rounded-2xl border border-border/60 bg-accent/30 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-emerald-600" />
              Looking to contribute fare updates?
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              If you noticed a new bus fare, updated transit card price, or a new city route, you don&apos;t need to write an email! You can use the &quot;Contribute Info&quot; button at the top of any page to submit updates directly to our editorial team.
            </p>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
