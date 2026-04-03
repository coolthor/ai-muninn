import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ai-muninn',
  metadataBase: new URL('https://ai-muninn.com'),
  openGraph: {
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={geistMono.variable}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-S2HNHJTK4B" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S2HNHJTK4B');
        `}</Script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
