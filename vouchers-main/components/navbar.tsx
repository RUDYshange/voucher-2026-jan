"use client"

/**
 * Navbar Component
 * 
 * Main navigation bar for the VoucherTrade application.
 * Displays different UI based on authentication state:
 * - Unauthenticated: Shows Sign In and Sign Up buttons
 * - Authenticated Buyer: Shows cart icon and user menu
 * - Authenticated Seller: Shows custom sell voucher link
 * 
 * Features:
 * - Responsive design (hidden on mobile)
 * - Cart item count badge
 * - User email and account type display
 * - Sign out functionality
 * 
 * @component
 * @returns {JSX.Element} Navigation bar element
 */

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { isSignedIn, userEmail, userType, signOut } = useAuth()
  const { getCartCount } = useCart()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const handleSellVoucherClick = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault()
      router.push("/register")
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <span className="text-3xl">💳</span> VoucherTrade
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/vouchers" className="text-foreground hover:text-primary transition">
            Browse Vouchers
          </Link>
          <Link href="/upload" onClick={handleSellVoucherClick} className="text-foreground hover:text-primary transition">
            Sell Voucher
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && (
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-foreground hover:text-primary transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>
          )}
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-semibold text-foreground">{userEmail}</p>
                <p className="text-xs text-muted-foreground capitalize">{userType} Account</p>
              </div>
              <button onClick={handleSignOut} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
