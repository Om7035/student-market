import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { DemoNotice } from "@/components/demo-notice"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Market - Pune's Premier Student Services Platform",
  description: "Connect with talented students for tutoring, design, coding, and more in Pune, India",
  keywords: "student services, tutoring, freelance, college, marketplace, pune, india",
  authors: [{ name: "Student Market Team" }],
  creator: "Student Market",
  publisher: "Student Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://studentmarket.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Student Market - Pune's Premier Student Services Platform",
    description: "Connect with talented students for tutoring, design, coding, and more in Pune, India",
    url: "https://studentmarket.in",
    siteName: "Student Market",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Market - Pune's Premier Student Services Platform",
    description: "Connect with talented students for tutoring, design, coding, and more in Pune, India",
    creator: "@studentmarket",
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
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen pb-20 md:pb-0">
            <div className="container mx-auto px-4 pt-4">
              <DemoNotice />
            </div>
            {children}
          </main>
          <MobileNav user={null} unreadCount={2} />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
