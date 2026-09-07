import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'WayToCity — Urban Transit & Travel Guide',
  description:
    'An ultra-minimalist urban transit and travel guide. Navigate the city with transit routes, 24-hour itineraries, food spots, and curated tours.',
  generator: 'WayToCity',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
        {children}
        <Script
          id="tp-drive"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function () {
      var script = document.createElement("script");
      script.async = 1;
      script.setAttribute("data-cmp-ab","2");
      script.src = 'https://emrldtp.cc/NTcxMzA4.js?t=571308';
      document.head.appendChild(script);
  })();`,
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
