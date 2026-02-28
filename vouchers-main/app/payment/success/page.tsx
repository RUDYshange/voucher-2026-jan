"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import vouchersData from "@/data/vouchers.json"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('id')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    // Retrieve payment info from sessionStorage
    const storedPayment = sessionStorage.getItem('pendingPayment')
    if (storedPayment) {
      setPaymentDetails(JSON.parse(storedPayment))
      // Clear the stored payment
      sessionStorage.removeItem('pendingPayment')
    }
  }, [])

  const voucher = paymentDetails ? vouchersData.find(v => v.id === paymentDetails.voucherId) : null

  // Generate a mock voucher code
  const generateVoucherCode = () => {
    return `${voucher?.brand.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">Payment Successful!</h1>
              <p className="text-lg text-muted-foreground">
                Your voucher has been purchased and is ready to use
              </p>
            </div>

            {/* Payment Details Card */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm font-semibold text-foreground">{paymentId}</span>
                </div>

                {paymentDetails && (
                  <>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-foreground text-lg">R{paymentDetails.amount}</span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-semibold text-foreground">{paymentDetails.email}</span>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-semibold text-foreground">
                        {new Date().toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Voucher Code Card */}
            {voucher && (
              <div className="card bg-primary/5 border-2 border-primary mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Voucher Code</h2>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Voucher Code</p>
                  <p className="text-3xl font-mono font-bold text-primary mb-4 tracking-wider">
                    {generateVoucherCode()}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Voucher is active and ready to use</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p><strong>Brand:</strong> {voucher.brand}</p>
                  <p><strong>Face Value:</strong> R{voucher.faceValue}</p>
                  <p><strong>Expires:</strong> {new Date(voucher.expiryDate).toLocaleDateString('en-ZA')}</p>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> A copy of this voucher code has been sent to <strong>{paymentDetails?.email}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* How to Redeem */}
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">How to Redeem</h2>

              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Visit the {voucher?.brand} website or store</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Enter your voucher code at checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Enjoy your discount!</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vouchers" className="flex-1 btn-primary text-center">
                Browse More Vouchers
              </Link>
              <Link href="/dashboard" className="flex-1 btn-secondary text-center">
                View Order History
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <a href="#" className="text-primary hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
