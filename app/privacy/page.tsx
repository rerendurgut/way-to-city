import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | WayToCity',
  description: 'WayToCity Privacy Policy explaining cookie usage, analytics tracking, and data submission practices.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between animate-fade-in">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <header className="border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Shield className="size-3.5" />
              <span>Legal &amp; Data Protection</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: September 2026
            </p>
          </header>

          <article className="prose prose-slate dark:prose-invert max-w-none mt-10 space-y-8 text-foreground/90 text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">1. Introduction</h2>
              <p>
                WayToCity (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting the personal data of visitors to our website (waytocity.com). This Privacy Policy explains how we collect, use, and safeguard information when you browse our urban transit guides or submit community contributions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">2. Information We Collect</h2>
              <p>We collect minimal personal data to maintain and improve our services:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Analytics Data:</strong> We use Vercel Analytics and Google Analytics to collect anonymized usage metrics, such as page views, device types, browser types, and country of origin. No personally identifiable information (PII) is logged.
                </li>
                <li>
                  <strong className="text-foreground">Community Submissions:</strong> When you submit a transit fare update or city correction via our &quot;Contribute Info&quot; form, we process the information provided (e.g. city name, item category, description, custom fare values). Submissions do not require personal account registration.
                </li>
                <li>
                  <strong className="text-foreground">Cookies &amp; Local Storage:</strong> We use essential functional cookies and browser local storage strictly necessary for website operation, user preference preferences (such as theme selection), and security.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">3. Third-Party Links &amp; Affiliates</h2>
              <p>
                Our guides contain links to third-party travel providers, eSIM services, ticket booking engines, and accommodation providers. Clicking these external links redirects you to third-party domains governed by their respective privacy policies. We encourage you to review the privacy notices of any external site you visit.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">4. Data Security &amp; Retention</h2>
              <p>
                We implement industry-standard security measures (HTTPS SSL encryption, secure API endpoints, and Supabase security policies) to protect submitted contribution data against unauthorized access, loss, or alteration.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">5. Contact Information</h2>
              <p>
                If you have any questions or privacy concerns regarding this Privacy Policy, please contact us at{' '}
                <a href="mailto:hello@waytocity.com" className="text-emerald-600 dark:text-emerald-400 font-semibold underline">
                  hello@waytocity.com
                </a>.
              </p>
            </section>
          </article>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
