import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ContributeProvider } from '@/components/contribute-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waytocity.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'WayToCity — Urban Transit Guide, Public Transport Fares & City Travel Guides',
    template: '%s',
  },
  description:
    'Global urban transit and travel guide. Explore bus and metro ticket prices, public transport cards, airport transfer routes, and top attractions worldwide.',
  generator: 'WayToCity',
  applicationName: 'WayToCity',
  keywords: [
    'urban transit guide',
    'public transport fares',
    'bus ticket prices',
    'metro fares',
    'transit cards',
    'city travel guide',
    'things to do',
    'airport transfer',
    'waytocity',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'WayToCity — Urban Transit Guide, Public Transport Fares & City Travel Guides',
    description:
      'Global urban transit and travel guide. Explore bus and metro ticket prices, public transport cards, airport transfer routes, and top attractions worldwide.',
    siteName: 'WayToCity',
    images: [
      {
        url: `${siteUrl}/api/og?title=WayToCity&subtitle=Urban+Transit+Guide+%26+Public+Transport+Fares`,
        width: 1200,
        height: 630,
        alt: 'WayToCity Transit & Travel Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WayToCity — Urban Transit Guide, Public Transport Fares & City Travel Guides',
    description:
      'Global urban transit and travel guide. Explore bus and metro ticket prices, public transport cards, airport transfer routes, and top attractions worldwide.',
    images: [`${siteUrl}/api/og?title=WayToCity&subtitle=Urban+Transit+Guide+%26+Public+Transport+Fares`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ContributeProvider>{children}</ContributeProvider>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
