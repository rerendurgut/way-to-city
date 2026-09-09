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
    default: 'WayToCity — Şehir İçi Ulaşım Rehberi, Bilet Fiyatları & Gezilecek Yerler',
    template: '%s',
  },
  description:
    'Dünya şehirlerinde otobüs, metro, raylı sistem bilet fiyatları, toplu taşıma kartları, havalimanı ulaşım rotaları ve gezilecek yerler rehberi.',
  generator: 'WayToCity',
  applicationName: 'WayToCity',
  keywords: [
    'şehir içi ulaşım rehberi',
    'bilet fiyatları',
    'toplu taşıma kartı',
    'otobüs bileti',
    'gezilecek yerler',
    'urban transit guide',
    'public transport fare',
    'waytocity',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    title: 'WayToCity — Şehir İçi Ulaşım Rehberi, Bilet Fiyatları & Gezilecek Yerler',
    description:
      'Dünya şehirlerinde otobüs, metro, raylı sistem bilet fiyatları, toplu taşıma kartları, havalimanı ulaşım rotaları ve gezilecek yerler rehberi.',
    siteName: 'WayToCity',
    images: [
      {
        url: `${siteUrl}/api/og?title=WayToCity&subtitle=Şehir+İçi+Ulaşım+Rehberi+%26+Bilet+Fiyatları`,
        width: 1200,
        height: 630,
        alt: 'WayToCity Ulaşım Rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WayToCity — Şehir İçi Ulaşım Rehberi, Bilet Fiyatları & Gezilecek Yerler',
    description:
      'Dünya şehirlerinde otobüs, metro, raylı sistem bilet fiyatları, toplu taşıma kartları, havalimanı ulaşım rotaları ve gezilecek yerler rehberi.',
    images: [`${siteUrl}/api/og?title=WayToCity&subtitle=Şehir+İçi+Ulaşım+Rehberi+%26+Bilet+Fiyatları`],
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
