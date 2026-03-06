import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/lib/cart-context"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://agriconnect.com"),
  title: "AgriConnect - Connecting Farmers to Global Markets",
  description: "One platform for schemes, exports, community, and modern farming tools. Empowering farmers with technology and global connections.",
  openGraph: {
    title: "AgriConnect",
    description: "One platform for farmers and exporters.",
    url: "https://agriconnect.com",
    siteName: "AgriConnect",
    images: [
      {
        url: "/modern-farmers-using-technology-with-tractors-and-.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriConnect",
    description: "One platform for farmers and exporters.",
    images: ["/modern-farmers-using-technology-with-tractors-and-.png"],
  },
  generator: "Next.js",
}

import { FloatingCartButton } from "@/components/floating-cart-button"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <CartProvider>
          {children}
          <FloatingCartButton />
        </CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}

