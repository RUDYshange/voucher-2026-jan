"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('id')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    // Retrieve payment info from sessionStorage
    const storedPayment = sessionStorage.getItem('pendingPayment')
    if (storedPayment) {
      setPaymentDetails(JSON.parse(storedPayment))
      // Don't clear it yet - user might retry
    }
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">Payment Failed</h1>
              <p className="text-lg text-muted-foreground">
                Unfortunately, we couldn't process your payment
              </p>
            </div>

            {/* Payment Details Card */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm font-semibold text-foreground">{paymentId}</span>
                </div>

                {paymentDetails && (
                  <>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-foreground text-lg">R{paymentDetails.amount}</span>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Status</span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Failed
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Reasons */}
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Common Reasons for Payment Failure</h2>

              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Incorrect payment details</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Bank declined the transaction</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Network or connection issue</span>
                </li>
                <li className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Payment timeout or cancellation</span>
                </li>
              </ul>
            </div>

            {/* What to Do Next */}
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">What to Do Next</h2>

              <div className="space-y-3 text-blue-800 dark:text-blue-200">
                <p>• Check your bank account balance and daily transaction limits</p>
                <p>• Verify your payment details are correct</p>
                <p>• Try using a different payment method</p>
                <p>• Contact your bank if the problem persists</p>
                <p>• Reach out to our support team for assistance</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {paymentDetails && (
                <Link
                  href={`/checkout/${paymentDetails.voucherId}`}
                  className="flex-1 btn-primary text-center"
                >
                  Try Again
                </Link>
              )}
              <Link href="/vouchers" className="flex-1 btn-secondary text-center">
                Browse Other Vouchers
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help with your payment?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                <a href="#" className="text-primary hover:underline font-semibold">
                  Contact Support
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="tel:+27211234567" className="text-primary hover:underline font-semibold">
                  Call: +27 21 123 4567
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="mailto:support@vouchertrade.co.za" className="text-primary hover:underline font-semibold">
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
