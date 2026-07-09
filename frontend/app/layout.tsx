import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

import { AppProviders } from "@/components/AppProviders";
import {
  JsonLd,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

import "./globals.css";

import AssistLoopWidget from "@/components/AssistLoopWidget";
import ClarityProvider from "@/components/ClarityProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  other: {
    monetag: "34eef038f7f433a9b56909d3a24753bb",
  },

  verification: {
    other: {
      "msvalidate.01": "E49B6F04F0754D48F88A4CBEAB62E58C",
    },
  },
  
  title: {
    default:
      "GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "GATEPrep Pro helps GATE Electrical Engineering aspirants plan study weeks, revise formulas, solve PYQs, track tests, manage notes, and analyze cutoffs.",
  keywords: [
    "GATE EE preparation",
    "GATE Electrical Engineering",
    "GATE study planner",
    "GATE PYQ",
    "GATE flashcards",
    "GATE cutoff",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title:
      "GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests",
    description:
      "Prepare for GATE Electrical Engineering with study plans, notes, lectures, PYQs, flashcards, tests, cutoff analysis, and AI coaching.",
    images: [
      {
        url: "/pwa-icon-512.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} app icon`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GATEPrep Pro | GATE EE Study Planner, PYQs, Flashcards and Tests",
    description:
      "Prepare for GATE Electrical Engineering with study plans, notes, lectures, PYQs, flashcards, tests, cutoff analysis, and AI coaching.",
    images: ["/pwa-icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/pwa-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-background"
    >
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Monetag */}
        <Script
          id="monetag-tag"
          src="https://quge5.com/88/tag.min.js"
          data-zone="253559"
          data-cfasync="false"
          strategy="afterInteractive"
          async
        />

        {/* Adsterra */}
      <Script
        id="monetag-social-bar"
        src="https://contributionhobblenewlywed.com/ba/f1/ac/baf1ac0502d14cea525c25f8ede28f1f.js"
        strategy="afterInteractive"
        async
      />
        
        {/* Google Tag Manager */}
        {/* <GoogleTagManager gtmId="GTM-55MTFZWQ" /> */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-55MTFZWQ');
          `}
        </Script>

         {/* Google AdSense */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7785471383949630"
          crossOrigin="anonymous"
        />
        
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-55MTFZWQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Microsoft Clarity */}
        <ClarityProvider />

        {/* Structured Data */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <AppProviders>
          {children}

          {process.env.NODE_ENV === "production" && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </AppProviders>

        <AssistLoopWidget />
      </body>
    </html>
  );
}
