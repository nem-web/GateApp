import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/components/AppProviders'
import { JsonLd, SITE_NAME, SITE_URL, organizationSchema, websiteSchema } from '@/lib/seo'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'GATEPrep Pro helps GATE Electrical Engineering aspirants plan study weeks, revise formulas, solve PYQs, track tests, manage notes, and analyze cutoffs.',
  keywords: [
    'GATE EE preparation',
    'GATE Electrical Engineering',
    'GATE study planner',
    'GATE PYQ',
    'GATE flashcards',
    'GATE cutoff',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: '/',
    title: 'GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests',
    description:
      'Prepare for GATE Electrical Engineering with study plans, notes, lectures, PYQs, flashcards, tests, cutoff analysis, and AI coaching.',
    images: [
      {
        url: '/pwa-icon-512.png',
        width: 512,
        height: 512,
        alt: `${SITE_NAME} app icon`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests',
    description:
      'Prepare for GATE Electrical Engineering with study plans, notes, lectures, PYQs, flashcards, tests, cutoff analysis, and AI coaching.',
    images: ['/pwa-icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0F1117',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <AppProviders>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AppProviders>
      </body>
    </html>
  )
}
