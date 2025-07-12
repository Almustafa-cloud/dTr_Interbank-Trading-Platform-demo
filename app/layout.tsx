import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "dTr_Interbank - Professional Trading Platform",
  description:
    "Institutional-grade trading platform providing real-time interbank rates, advanced analytics, and professional trading tools for financial institutions worldwide.",
  keywords: "interbank, trading, institutional, professional, deriv, real-time, analytics, financial",
  authors: [{ name: "dTr_Interbank Team" }],
  openGraph: {
    title: "dTr_Interbank - Professional Trading Platform",
    description: "Institutional-grade trading with real-time interbank rates and advanced analytics",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
