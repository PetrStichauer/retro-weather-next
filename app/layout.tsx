import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://retro-weather-next.vercel.app'

export const metadata: Metadata = {
  title: 'RetroWeather 3000',
  description:
    'A nostalgic 90s dial-up weather app — no API key required. Powered by Open-Meteo.',
  metadataBase: new URL(siteUrl),
  keywords: ['weather', 'retro', 'nextjs', 'open-meteo', '90s'],
  authors: [{ name: 'Petr Stichauer', url: 'https://github.com/PetrStichauer' }],
  openGraph: {
    title: 'RetroWeather 3000',
    description:
      'A nostalgic 90s dial-up weather app — no API key required.',
    url: siteUrl,
    siteName: 'RetroWeather 3000',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RetroWeather 3000' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetroWeather 3000',
    description:
      'A nostalgic 90s dial-up weather app — no API key required.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-retro text-retro-teal" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
