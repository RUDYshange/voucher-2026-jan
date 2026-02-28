"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"
import vouchersData from "@/data/vouchers.json"
import { payshapService, formatCurrency, validateSAPhoneNumber, formatPhoneNumber, type PaymentRequest } from "@/lib/payshap"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { toasts, showToast } = useToast()
  const voucherId = params.voucherId as string

  const voucher = vouchersData.find((v) => v.id === Number(voucherId))
  const buyerPrice = voucher ? Math.round(voucher.faceValue * 0.9) : 0

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!voucher) {
      showToast("Voucher not found", "error")
      router.push("/vouchers")
    }
  }, [voucher, router, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validateSAPhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid South African phone number (e.g., 0821234567)"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      showToast("Please correct the errors in the form", "error")
      return
    }

    if (!voucher) {
      showToast("Voucher not found", "error")
      return
    }

    setIsProcessing(true)

    try {
      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: buyerPrice,
        currency: "ZAR",
        description: `${voucher.brand} Voucher - R${voucher.faceValue} Face Value`,
        customerEmail: formData.email,
        customerPhone: formatPhoneNumber(formData.phone),
        orderId: `VT_${Date.now()}_${voucherId}`,
        metadata: {
          voucherId: voucher.id,
          voucherBrand: voucher.brand,
          faceValue: voucher.faceValue,
          buyerPrice: buyerPrice,
          customerName: formData.fullName,
        }
      }

      // Initiate payment with PayShap
      const response = await payshapService.initiatePayment(paymentRequest)

      if (response.success && response.paymentId) {
        showToast("Redirecting to payment...", "success")

        // Store payment info in sessionStorage for reference
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          paymentId: response.paymentId,
          voucherId: voucher.id,
          amount: buyerPrice,
          email: formData.email,
          phone: formData.phone,
        }))

        // Redirect to payment processing page
        setTimeout(() => {
          router.push(`/payment/process?id=${response.paymentId}`)
        }, 1000)
      } else {
        showToast(response.error || "Failed to initiate payment", "error")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      showToast("An error occurred. Please try again.", "error")
      setIsProcessing(false)
    }
  }

  if (!voucher) {
    return null
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Payment Form */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.fullName ? "border-danger" : "border-border"
                      } bg-background text-foreground`}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-danger mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-danger" : "border-border"
                      } bg-background text-foreground`}
                    />
                    {errors.email && (
                      <p className="text-sm text-danger mt-1">{errors.email}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Voucher code will be sent to this email
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0821234567"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? "border-danger" : "border-border"
                      } bg-background text-foreground`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-danger mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="pt-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <span className="text-sm text-foreground">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-danger mt-1">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="flex items-center gap-4 p-4 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="text-3xl">💳</div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">PayShap Instant Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Secure instant bank transfer via PayShap
                    </p>
                  </div>
                  <span className="badge badge-success">Secure</span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="mb-6 p-4 bg-muted rounded-lg flex items-center gap-4">
                  <Image
                    src={voucher.logo || "/placeholder.svg"}
                    alt={voucher.brand}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-foreground">{voucher.brand}</h3>
                    <p className="text-sm text-muted-foreground">{voucher.category}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Face Value</span>
                    <span className="font-semibold text-foreground">R{voucher.faceValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount (10%)</span>
                    <span className="font-semibold text-success">
                      -R{voucher.faceValue - buyerPrice}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">R{buyerPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay R${buyerPrice}`}
                </button>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant voucher delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Buyer protection guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
