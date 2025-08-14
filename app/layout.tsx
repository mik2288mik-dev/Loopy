import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { TelegramProvider } from "@/components/telegram-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "LOOPI",
  description: "Share your moments, round and vibrant. Join the loop where every video is a new adventure.",
  generator: "v0.app",
  keywords: ["video", "social media", "circles", "telegram", "mini app", "content creation"],
  authors: [{ name: "Loopy Team" }],
  creator: "Loopy",
  publisher: "Loopy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://loopy-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOOPI",
    description: "Share your moments, round and vibrant. Join the loop where every video is a new adventure.",
    url: "https://loopy-app.vercel.app",
    siteName: "Loopy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loopy - Capture Life in Circles",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOOPI",
    description: "Share your moments, round and vibrant. Join the loop where every video is a new adventure.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <meta name="theme-color" content="#0B0D10" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                  <meta name="apple-mobile-web-app-title" content="LOOPI" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
             <body className="font-sans antialiased bg-[#0B0D10] text-white">
        <ErrorBoundary>
          <TelegramProvider>
            {children}
            <OfflineIndicator />
          </TelegramProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
