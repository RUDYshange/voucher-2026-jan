"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast, ToastContainer } from "@/components/toast"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { toasts, showToast } = useToast()

  useEffect(() => {
    if (!isSignedIn) {
      showToast("Please sign in to view your cart", "error")
      router.push("/login")
    }
  }, [isSignedIn, router, showToast])

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty", "error")
      return
    }
    router.push("/checkout/cart")
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding vouchers to your cart to see them here
              </p>
              <Link href="/vouchers" className="btn-primary inline-block">
                Browse Vouchers
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="card flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.logo || "/placeholder.svg"}
                        alt={item.brand}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-1">{item.brand}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Face Value: R{item.faceValue}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-danger hover:underline text-sm"
                      >
                        Remove
                      </button>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary mb-2">R{item.buyerPrice}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded border border-border hover:bg-muted"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded border border-border hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-danger hover:underline text-sm"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items ({getCartCount()})</span>
                      <span className="font-semibold text-foreground">R{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold text-success">Instant Digital</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">R{getCartTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleCheckout} className="w-full btn-primary py-4 font-bold text-lg mb-4">
                    Proceed to Checkout
                  </button>

                  <Link href="/vouchers" className="block text-center text-primary hover:underline">
                    Continue Shopping
                  </Link>

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
                      <span>Instant delivery</span>
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
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
