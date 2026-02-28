"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast, ToastContainer } from "@/components/toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toasts, showToast } = useToast()
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error")
      return
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }

    if (!agreeTerms) {
      showToast("Please agree to terms and conditions", "error")
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber: phone,
          accountType: userType.toUpperCase()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || "Registration failed", "error")
        return
      }

      showToast(`Welcome to VoucherTrade! Registered as ${userType}.`, "success")
      setTimeout(() => {
        router.push(userType === "buyer" ? "/vouchers" : "/login")
      }, 1000)
    } catch (error) {
      showToast("An error occurred during registration", "error")
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted py-12">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join VoucherTrade and start buying or selling vouchers</p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6 max-w-xl mx-auto">
              <p className="text-sm text-foreground">
                <span className="font-semibold">💡 To sell vouchers,</span> you need to create an account first.
                Registration is quick and helps us keep the marketplace safe for everyone.
              </p>
            </div>
          </div>

          <div className="card">
            {/* User Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-4">
                How do you want to use VoucherTrade?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType("buyer")}
                  className={`p-6 rounded-lg border-2 transition text-center ${userType === "buyer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="text-4xl mb-2">🛍️</div>
                  <h3 className="font-bold text-foreground mb-1">Buyer</h3>
                  <p className="text-sm text-muted-foreground">Save money on favorite brands</p>
                </button>

                <button
                  onClick={() => setUserType("seller")}
                  className={`p-6 rounded-lg border-2 transition text-center ${userType === "seller" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex justify-center mb-2">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">R</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Seller</h3>
                  <p className="text-sm text-muted-foreground">Sell unwanted vouchers</p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 123 456 7890"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-foreground">
                    I agree to VoucherTrade's{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full btn-primary py-3 font-bold text-lg">
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Terms of Service</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground">
                  By accessing and using VoucherTrade, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">2. Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use VoucherTrade. By using our platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into binding contracts.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">3. User Accounts</h3>
                <p className="text-muted-foreground mb-2">
                  When creating an account, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Not create multiple accounts or share accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">4. Seller Obligations</h3>
                <p className="text-muted-foreground mb-2">
                  As a seller, you warrant that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>All vouchers listed are legitimate and legally obtained</li>
                  <li>Vouchers have not been previously used or redeemed</li>
                  <li>You have the right to sell the voucher</li>
                  <li>All information provided is accurate and truthful</li>
                  <li>You will not engage in fraudulent activity</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">5. Buyer Obligations</h3>
                <p className="text-muted-foreground mb-2">
                  As a buyer, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Pay for vouchers before receiving them</li>
                  <li>Confirm receipt within 24 hours of receiving the voucher</li>
                  <li>Report any issues within 48 hours</li>
                  <li>Use vouchers in accordance with the issuer's terms</li>
                  <li>Not attempt to dispute valid transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Fees and Payments</h3>
                <p className="text-muted-foreground">
                  VoucherTrade charges a platform fee on all transactions. Sellers receive 70% of the voucher face value, buyers pay 90% of face value, and VoucherTrade retains the difference as a service fee. All fees are clearly displayed before transaction completion.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">7. Prohibited Activities</h3>
                <p className="text-muted-foreground mb-2">
                  Users are prohibited from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Listing stolen, fraudulent, or counterfeit vouchers</li>
                  <li>Using the platform for money laundering</li>
                  <li>Manipulating pricing or engaging in price fixing</li>
                  <li>Harassing other users</li>
                  <li>Attempting to circumvent platform fees</li>
                  <li>Reverse engineering or scraping the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">8. Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  In case of disputes, VoucherTrade will act as a mediator. Our decision in disputes is final. We reserve the right to withhold payments, suspend accounts, or take legal action if fraud is suspected.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">9. Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  VoucherTrade acts as an intermediary platform. We are not responsible for the validity of vouchers, the actions of users, or disputes arising from transactions. Our liability is limited to the amount of fees charged for the specific transaction in question.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">10. Intellectual Property</h3>
                <p className="text-muted-foreground">
                  All content, trademarks, and intellectual property on VoucherTrade belong to us or our licensors. You may not use, copy, or distribute our content without written permission.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">11. Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to the platform or other users. Termination may result in forfeiture of pending transactions.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">12. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">13. Governing Law</h3>
                <p className="text-muted-foreground">
                  These terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 2025<br />
                  <strong>Effective Date:</strong> January 2025
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowTerms(false)} className="w-full btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. Information We Collect</h3>
                <p className="text-muted-foreground mb-2">
                  When you use VoucherTrade, we collect the following information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Payment and banking details for processing transactions</li>
                  <li>Voucher images and proof of purchase documents</li>
                  <li>Transaction history and account activity</li>
                  <li>Device information and IP address for security purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">2. How We Use Your Information</h3>
                <p className="text-muted-foreground mb-2">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Verify and process voucher listings</li>
                  <li>Facilitate secure transactions between buyers and sellers</li>
                  <li>Process payments and payouts</li>
                  <li>Communicate with you about your transactions and account</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">3. Information Sharing</h3>
                <p className="text-muted-foreground">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>Payment processors to complete transactions</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other users (limited information) necessary to complete transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">4. Data Security</h3>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">5. Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as your account is active or as needed to provide services. Transaction records are kept for 7 years to comply with South African tax and financial regulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">6. Your Rights</h3>
                <p className="text-muted-foreground mb-2">
                  Under the Protection of Personal Information Act (POPIA), you have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">7. Cookies</h3>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to improve your experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">8. Third-Party Links</h3>
                <p className="text-muted-foreground">
                  Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">9. Children's Privacy</h3>
                <p className="text-muted-foreground">
                  VoucherTrade is not intended for users under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">10. Changes to This Policy</h3>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify you of any significant changes by email or through a notice on our platform.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">11. Contact Us</h3>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy or how we handle your personal information, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: privacy@vouchertrade.co.za<br />
                  Address: Cape Town, South Africa
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> January 2025<br />
                  <strong>Effective Date:</strong> January 2025
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowPrivacy(false)} className="w-full btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
