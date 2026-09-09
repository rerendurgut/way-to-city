import Link from 'next/link'
import { Navigation } from 'lucide-react'
import { XIcon, InstagramIcon } from '@/components/social-icons'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm mt-16">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand & Mission Short */}
          <div className="space-y-2 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex size-7 items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
                <Navigation className="size-3.5" />
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-emerald-600 transition-colors">
                WayToCity
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              WayToCity is a community-driven travel guide providing up-to-date public transit fares, card rates, airport routes, and city tips worldwide.
            </p>
          </div>

          {/* Institutional Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link href="/about" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              About Us
            </Link>
            <Link href="/contact" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Contact Us
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Terms of Service
            </Link>
            <Link href="/affiliate-disclosure" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
              Affiliate Disclosure
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/waytocity"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WayToCity on X (Twitter)"
              className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-accent/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </a>
            <a
              href="https://instagram.com/waytocity"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WayToCity on Instagram"
              className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-accent/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <InstagramIcon className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/80">
          <span>&copy; {new Date().getFullYear()} WayToCity. All rights reserved.</span>
          <p className="text-[11px] max-w-md text-center sm:text-right text-muted-foreground/70">
            WayToCity contains affiliate links. When you book via our links, we may earn a small commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
