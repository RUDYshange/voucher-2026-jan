"use client"

/**
 * Homepage Component
 * 
 * Main landing page for VoucherTrade application.
 * Displays:
 * - Hero section with value proposition
 * - Featured vouchers/testimonials
 * - Call-to-action buttons
 * - Navigation and information
 * 
 * Features:
 * - Responsive design for all screen sizes
 * - Interactive elements with smooth animations
 * - Integrated navigation and footer
 * - AuthContext awareness for conditional rendering
 * 
 * @component
 * @returns {JSX.Element} The homepage layout
 */

import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * Voucher data interface used on homepage
 */
interface Voucher {
  id: string;
  brand: string;
  logo: string;
  category: string;
  faceValue: number;
  expiryDate: string;
  description: string;
  verified: boolean;
  outlet: string;
}

interface Brand {
  name: string;
  logo: string;
}

export default function Home() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch('/api/vouchers')
      .then((res) => res.json())
      .then((vouchers: Voucher[]) => {
        const uniqueBrands: Brand[] = [];
        const brandNames = new Set<string>();
        vouchers.forEach((v) => {
          if (!brandNames.has(v.brand)) {
            brandNames.add(v.brand);
            uniqueBrands.push({ name: v.brand, logo: v.logo });
          }
        });
        setBrands(uniqueBrands);
      })
      .catch((error) => console.error("Failed to fetch vouchers:", error));
  }, []);

  const handleSellVoucherClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      router.push("/register")
    } else {
      router.push("/upload")
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')",
            }}
          />

          {/* Content */}
          <div className="container text-center relative z-10">
            <h1 className="text-5xl font-bold mb-6 text-balance !text-white" style={{ color: '#ffffff' }}>Shop Smart. Trade Smarter. Save Big.</h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto text-balance">
              Get premium vouchers at up to 10% off or turn unwanted gift cards into cash. VoucherTrade is South
              Africa's easiest way to buy and sell digital vouchers.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/vouchers"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Buy a Voucher
              </Link>
              <Link
                href={isSignedIn ? "/upload" : "/register"}
                onClick={handleSellVoucherClick}
                className="bg-accent text-red-500 px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition"
              >
                Sell a Voucher
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How VoucherTrade Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">R</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Sellers Get 70%</h3>
                <p className="text-muted-foreground">
                  Sell your unwanted vouchers and receive 70% of the face value directly to your account.
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Buyers Save 10%</h3>
                <p className="text-muted-foreground">
                  Purchase vouchers at 10% discount. Shop your favorite retailers while saving money.
                </p>
              </div>

              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">100% Safe & Verified</h3>
                <p className="text-muted-foreground">
                  Every voucher is verified. All transactions are secure with buyer protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Brands */}
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Popular Brands</h2>
            <p className="text-center text-muted-foreground mb-12">Find vouchers from your favorite retailers</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="bg-background p-6 rounded-lg text-center border border-border hover:border-primary transition flex items-center justify-center h-28"
                >
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    width={100}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of South Africans saving money on vouchers.</p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={isSignedIn ? "/dashboard" : "/register"}
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                {isSignedIn ? "Go to Dashboard" : "Get Started Now"}
              </Link>
              <Link
                href="/vouchers"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition"
              >
                Browse Vouchers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
