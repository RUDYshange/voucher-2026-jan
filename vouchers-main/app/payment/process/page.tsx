"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { payshapService } from "@/lib/payshap"

export default function PaymentProcessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('id')

  const [processing, setProcessing] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!paymentId) {
      router.push('/vouchers')
      return
    }

    // Simulate payment processing
    const processPayment = async () => {
      try {
        // Wait 3 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Check payment status
        const status = await payshapService.checkPaymentStatus(paymentId)

        if (status.status === 'completed') {
          router.push(`/payment/success?id=${paymentId}`)
        } else if (status.status === 'failed') {
          router.push(`/payment/failed?id=${paymentId}`)
        } else {
          router.push(`/payment/failed?id=${paymentId}`)
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        router.push(`/payment/failed?id=${paymentId}`)
      }
    }

    processPayment()
  }, [paymentId, router])

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="container py-12">
          <div className="max-w-md mx-auto card text-center">
            {/* Loading Spinner */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Processing Payment</h1>
            <p className="text-muted-foreground mb-6">
              Please wait while we securely process your payment through PayShap...
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Payment ID</p>
              <p className="font-mono text-sm font-semibold text-foreground break-all">{paymentId}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Verifying payment details</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Communicating with bank</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Preparing your voucher</span>
              </div>
            </div>

            {countdown > 0 && (
              <p className="text-sm text-muted-foreground mt-6">
                Redirecting in {countdown} seconds...
              </p>
            )}

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Note:</strong> Do not close this window or press the back button
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
