/**
 * Root Layout Component
 * 
 * Main layout wrapper for the entire VoucherTrade application.
 * Provides global styling, authentication context, and shopping cart context.
 * Sets metadata including title and description for SEO.
 * 
 * @see AuthProvider - Manages user authentication state
 * @see CartProvider - Manages shopping cart state
 */

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VoucherTrade - Buy & Sell Digital Vouchers",
  description: "Buy unwanted vouchers at 10% discount. Sell your vouchers and get 70% value.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
