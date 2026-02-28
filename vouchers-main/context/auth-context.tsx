"use client"

/**
 * Authentication Context Module
 * 
 * Manages user authentication state across the application.
 * Supports two user types: buyers (purchasing vouchers) and sellers (uploading vouchers).
 * 
 * @module context/auth-context
 */

import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * AuthContextType
 * 
 * @typedef {Object} AuthContextType
 * @property {boolean} isSignedIn - Whether a user is currently authenticated
 * @property {"buyer" | "seller" | null} userType - The role of the authenticated user
 * @property {string | null} userEmail - The email address of the authenticated user
 * @property {Function} signIn - Function to authenticate a user
 * @property {Function} signOut - Function to logout the current user
 */
interface AuthContextType {
  isSignedIn: boolean
  userType: "buyer" | "seller" | null
  userEmail: string | null
  signIn: (email: string, userType: "buyer" | "seller") => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 * 
 * Wraps the application to provide authentication context to all child components.
 * Must be placed at a high level in the component tree, typically in the root layout.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap with auth context
 * @returns {JSX.Element} The provider element
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userType, setUserType] = useState<"buyer" | "seller" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const signIn = (email: string, type: "buyer" | "seller") => {
    setIsSignedIn(true)
    setUserEmail(email)
    setUserType(type)
  }

  const signOut = () => {
    setIsSignedIn(false)
    setUserEmail(null)
    setUserType(null)
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, userType, userEmail, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

/**
 * useAuth Hook
 * 
 * Custom hook to access the authentication context.
 * Must be called within a component wrapped by AuthProvider.
 * 
 * @returns {AuthContextType} The current authentication state and methods
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { isSignedIn, userType, userEmail, signIn, signOut } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
