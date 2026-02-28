"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { payshapService, validateSAPhoneNumber, formatPhoneNumber, type PaymentRequest } from "@/lib/payshap"

export default function CartCheckoutPage() {
  const router = useRouter()
  const { toasts, showToast } = useToast()
  const { cart, getCartTotal, getCartCount, clearCart } = useCart()
  const { isSignedIn } = useAuth()

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isSignedIn) {
      showToast("Please sign in to checkout", "error")
      router.push("/login")
    }
    if (cart.length === 0) {
      showToast("Your cart is empty", "error")
      router.push("/cart")
    }
  }, [isSignedIn, cart, router, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
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

    if (cart.length === 0) {
      showToast("Your cart is empty", "error")
      return
    }

    setIsProcessing(true)

    try {
      const paymentRequest: PaymentRequest = {
        amount: getCartTotal(),
        currency: "ZAR",
        description: `VoucherTrade - ${getCartCount()} voucher(s)`,
        customerEmail: formData.email,
        customerPhone: formatPhoneNumber(formData.phone),
        orderId: `VT_CART_${Date.now()}`,
        metadata: {
          items: cart.map(item => ({
            voucherId: item.id,
            brand: item.brand,
            quantity: item.quantity,
            price: item.buyerPrice,
          })),
          totalItems: getCartCount(),
          totalAmount: getCartTotal(),
          customerName: formData.fullName,
        }
      }

      const response = await payshapService.initiatePayment(paymentRequest)

      if (response.success && response.paymentId) {
        showToast("Redirecting to payment...", "success")

        sessionStorage.setItem('pendingPayment', JSON.stringify({
          paymentId: response.paymentId,
          cartItems: cart,
          amount: getCartTotal(),
          email: formData.email,
          phone: formData.phone,
        }))

        clearCart()

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

  if (!isSignedIn || cart.length === 0) {
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
                      Voucher codes will be sent to this email
                    </p>
                  </div>

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

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-border">
                      <Image
                        src={item.logo || "/placeholder.svg"}
                        alt={item.brand}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{item.brand}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground">R{item.buyerPrice * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({getCartCount()})</span>
                    <span className="font-semibold text-foreground">R{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold text-success">Instant</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">R{getCartTotal()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay R${getCartTotal()}`}
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
