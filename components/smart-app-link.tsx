'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Smartphone } from 'lucide-react'
import { parseAppLinks } from '@/lib/sheets'

interface SmartAppLinkProps {
  rawInput: string
}

export function SmartAppLink({ rawInput }: SmartAppLinkProps) {
  const [deviceOS, setDeviceOS] = useState<'ios' | 'android' | 'other'>('other')

  const { iosUrl, androidUrl, fallbackUrl, text } = parseAppLinks(rawInput)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ua = window.navigator.userAgent || window.navigator.vendor || ''
    if (/iPad|iPhone|iPod|Macintosh/i.test(ua)) {
      setDeviceOS('ios')
    } else if (/Android/i.test(ua)) {
      setDeviceOS('android')
    }
  }, [])

  if (!rawInput) return null

  // If input is purely plain text with no HTTP URLs
  if (!iosUrl && !androidUrl && !fallbackUrl) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Smartphone className="size-3.5 text-primary shrink-0" />
        {text || rawInput}
      </span>
    )
  }

  // Determine smart primary target URL based on device OS
  let primaryTargetUrl = fallbackUrl
  if (deviceOS === 'ios' && iosUrl) {
    primaryTargetUrl = iosUrl
  } else if (deviceOS === 'android' && androidUrl) {
    primaryTargetUrl = androidUrl
  } else {
    primaryTargetUrl = iosUrl || androidUrl || fallbackUrl
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* If both iOS and Android links exist, show dedicated store badges */}
      {iosUrl && (
        <a
          href={iosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            deviceOS === 'ios'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'border-border/80 bg-accent/60 text-foreground hover:border-emerald-500/40 hover:text-emerald-600'
          }`}
        >
          <svg
            className="size-3.5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.98 1.08.08 2.16-.58 2.81-1.38z" />
          </svg>
          <span>App Store</span>
          <ArrowUpRight className="size-3 text-muted-foreground" />
        </a>
      )}

      {androidUrl && (
        <a
          href={androidUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
            deviceOS === 'android'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'border-border/80 bg-accent/60 text-foreground hover:border-emerald-500/40 hover:text-emerald-600'
          }`}
        >
          <svg
            className="size-3.5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-1.58V3.394c0-.6.222-1.157.609-1.58zm11.3 9.074l2.585-2.585-9.61-5.548 7.025 8.133zm0 2.224l-7.025 8.133 9.61-5.548-2.585-2.585zM18.847 12l2.91-1.68a1.5 1.5 0 0 1 0 2.56L18.847 12z" />
          </svg>
          <span>Google Play</span>
          <ArrowUpRight className="size-3 text-muted-foreground" />
        </a>
      )}

      {/* Fallback link if no specific app store identified */}
      {!iosUrl && !androidUrl && primaryTargetUrl && (
        <a
          href={primaryTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-accent/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-emerald-500/40 hover:text-emerald-600"
        >
          <Smartphone className="size-3.5 text-primary shrink-0" />
          <span>{text || 'Download App'}</span>
          <ArrowUpRight className="size-3 text-muted-foreground" />
        </a>
      )}
    </div>
  )
}
