"use client"

/**
 * Shopping Cart Context Module
 * 
 * Manages the shopping cart state with persistent storage via localStorage.
 * Handles adding, removing, and updating items in the cart.
 * 
 * @module context/cart-context
 */

import React, { createContext, useContext, useState, useEffect } from "react"

/**
 * CartItem Interface
 * 
 * Represents a single item in the shopping cart.
 * 
 * @typedef {Object} CartItem
 * @property {number} id - Unique identifier for the voucher
 * @property {string} brand - Brand name of the voucher (e.g., "Takealot")
 * @property {string} logo - URL path to the brand logo
 * @property {string} category - Category of the voucher (e.g., "Shopping")
 * @property {number} faceValue - Original value of the voucher in ZAR
 * @property {number} buyerPrice - Price the buyer pays (90% of face value)
 * @property {string} expiryDate - ISO date string for when the voucher expires
 * @property {number} quantity - Number of this voucher item in the cart
 */
export interface CartItem {
  id: number
  brand: string
  logo: string
  category: string
  faceValue: number
  buyerPrice: number
  expiryDate: string
  quantity: number
}

/**
 * CartContextType
 * 
 * @typedef {Object} CartContextType
 * @property {CartItem[]} cart - Array of items in the cart
 * @property {Function} addToCart - Add or increment an item in the cart
 * @property {Function} removeFromCart - Remove an item from the cart
 * @property {Function} updateQuantity - Update the quantity of a cart item
 * @property {Function} clearCart - Empty the entire cart
 * @property {Function} getCartTotal - Calculate total price of all items
 * @property {Function} getCartCount - Get total number of items in cart
 */
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * CartProvider Component
 * 
 * Provides shopping cart functionality to the application.
 * Cart state is persisted to localStorage so items remain after page refresh.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} The provider element
 * 
 * @example
 * <CartProvider>
 *   <App />
 * </CartProvider>
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vouchertrade_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vouchertrade_cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Item already in cart, increase quantity
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        // New item, add to cart
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  /**
   * Calculate total amount for all items in cart
   * Uses buyerPrice (90% of face value) for each item
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.buyerPrice * item.quantity, 0)
  }

  /**
   * Get total number of items in cart (counting quantities)
   */
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/**
 * useCart Hook
 * 
 * Custom hook to access the shopping cart context.
 * Must be called within a component wrapped by CartProvider.
 * 
 * @returns {CartContextType} The current cart state and methods
 * @throws {Error} If used outside of CartProvider
 * 
 * @example
 * const { cart, addToCart, removeFromCart, getCartTotal } = useCart()
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
