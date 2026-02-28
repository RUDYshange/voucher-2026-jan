"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const { toasts, showToast } = useToast()
  const { isSignedIn, userEmail } = useAuth()
  const router = useRouter()
  const [voucherValue, setVoucherValue] = useState<number>(500)
  const [voucherProvider, setVoucherProvider] = useState<string>("Takealot")
  const [voucherType, setVoucherType] = useState<string>("Digital Code")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofFileName, setProofFileName] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  const [showFAQ, setShowFAQ] = useState<boolean>(false)
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false)
  const sellerPayout = Math.round(voucherValue * 0.7)

  // Redirect to registration if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      showToast("Please sign up to sell vouchers", "error")
      router.push("/register")
    }
  }, [isSignedIn, router, showToast])

  const providers = [
    "Takealot",
    "Woolworths",
    "Checkers",
    "Pick n Pay",
    "Uber Eats",
    "Netflix",
    "Spotify",
    "Superbalist",
    "iTunes",
    "Amazon SA",
  ]

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVoucherFile(file)
      setFileName(file.name)
    }
  }

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
      setProofFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (voucherValue < 500) {
      showToast("Minimum voucher value is R500", "error")
      return
    }
    if (voucherValue > 10000) {
      showToast("Maximum voucher value is R10,000", "error")
      return
    }
    if (!expiryDate) {
      showToast("Please select an expiry date", "error")
      return
    }
    const minExpiry = new Date()
    minExpiry.setMonth(minExpiry.getMonth() + 1)
    if (new Date(expiryDate) < minExpiry) {
      showToast("Expiry date must be at least one month from today", "error")
      return
    }
    if (!voucherFile) {
      showToast("Please upload a voucher image", "error")
      return
    }
    if (!proofFile) {
      showToast("Please upload proof of purchase (till slip)", "error")
      return
    }
    if (!agreeTerms) {
      showToast("Please confirm the privacy policy before submitting", "error")
      return
    }

    try {
      setIsSubmitting(true)

      // Convert images to base64 — sent to admin for review before any DB write
      const [voucherImage, proofImage] = await Promise.all([
        fileToBase64(voucherFile),
        fileToBase64(proofFile),
      ])

      const res = await fetch("/api/vouchers/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerEmail: userEmail,
          outlet: voucherProvider,
          faceValue: voucherValue,
          voucherType,
          expiryDate,
          description,
          voucherImage,
          proofImage,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        showToast(data.error || "Submission failed", "error")
        return
      }

      showToast("Voucher submitted for review! You will be notified within 24 hours.", "success")

      // Reset form
      setVoucherValue(500)
      setVoucherProvider("Takealot")
      setVoucherType("Digital Code")
      setExpiryDate("")
      setDescription("")
      setVoucherFile(null)
      setFileName("")
      setProofFile(null)
      setProofFileName("")
      setAgreeTerms(false)
    } catch {
      showToast("An error occurred during submission", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Sell Your Voucher</h1>
              <p className="text-muted-foreground">Get 70% of the voucher value when your voucher is purchased.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Voucher Details */}
              <div className="card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Voucher Details</h2>

                <div className="space-y-4">
                  {/* Provider */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Provider</label>
                    <select
                      value={voucherProvider}
                      onChange={(e) => setVoucherProvider(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      {providers.map((provider) => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Value (Rands)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold text-base" style={{ fontFamily: 'Arial, sans-serif' }}></span>
                      <input
                        type="number"
                        min="500"
                        max="10000"
                        step="50"
                        value={voucherValue}
                        onChange={(e) => setVoucherValue(Number(e.target.value))}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>
                    {voucherValue < 500 && <p className="text-sm text-danger mt-2">Minimum value is R500</p>}
                    {voucherValue > 10000 && <p className="text-sm text-danger mt-2">Maximum value is R10,000</p>}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Type</label>
                    <select
                      value={voucherType}
                      onChange={(e) => setVoucherType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option>Digital Code</option>
                      <option>PDF</option>
                      <option>Card</option>
                    </select>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Valid for all products, no restrictions..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Proof Upload */}
              <div className="card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Verification Documents</h2>
                <p className="text-muted-foreground mb-6">
                  Please upload both the voucher image and proof of purchase (e.g., till slip, receipt).
                
                </p>

                <div className="space-y-6">
                  {/* Voucher Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Voucher Image</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">🎟️</div>
                      <p className="font-semibold text-foreground mb-2">Upload Voucher Image</p>
                      <p className="text-sm text-muted-foreground mb-4">Screenshot or image of the voucher code</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="file-upload" className="inline-block btn-primary cursor-pointer">
                        Choose File
                      </label>
                      {fileName && <p className="text-sm text-success mt-4">✓ {fileName} selected</p>}
                    </div>
                  </div>

                  {/* Proof of Purchase Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Proof of Purchase</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="font-semibold text-foreground mb-2">Upload Proof of Purchase</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Till slip, receipt, or invoice showing purchase
                      </p>
                      <input
                        type="file"
                        onChange={handleProofUpload}
                        className="hidden"
                        id="proof-upload"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="proof-upload" className="inline-block btn-primary cursor-pointer">
                        Choose File 
                      </label>
                      {proofFileName && <p className="text-sm text-success mt-4">✓ {proofFileName} selected</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="card bg-primary/5 border border-primary/20">
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Earnings</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-foreground">Face Value</span>
                    <span className="font-bold text-foreground">R{voucherValue}</span>
                  </div>
                  <div className="border-t border-border my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">You Receive When Sold (70%)</span>
                    <span className="text-2xl font-bold text-success">R{sellerPayout}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Payment processed 5-7 days after purchase</p>
                </div>
              </div>

              {/* T&Cs */}
              <div className="card bg-muted">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                  <label htmlFor="terms" className="text-sm text-foreground">
                    I confirm that the voucher is legitimate, unused, and I have the right to sell it. I understand that
                    VoucherTrade reserves the right to reject vouchers that don't meet standards. By submitting, you agree to our{" "}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-4 text-lg font-bold disabled:opacity-60">
                {isSubmitting ? "Submitting..." : "Submit Voucher for Review"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Questions?{" "}
                <button
                  type="button"
                  onClick={() => setShowFAQ(true)}
                  className="text-primary hover:underline"
                >
                  See seller FAQ
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Seller FAQ</h2>
              <button
                onClick={() => setShowFAQ(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">How much will I receive for my voucher?</h3>
                <p className="text-muted-foreground">
                  You will receive 70% of the face value when your voucher is purchased. Payment is processed 5-7 business days after the buyer confirms receipt.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">How long does verification take?</h3>
                <p className="text-muted-foreground">
                  Our team reviews all vouchers within 24 hours. You'll receive an email notification once your voucher is approved and listed.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">What documents do I need?</h3>
                <p className="text-muted-foreground">
                  You need to upload both the voucher image (code/barcode) and proof of purchase (till slip or receipt). This helps us verify legitimacy.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">What if my voucher doesn't sell?</h3>
                <p className="text-muted-foreground">
                  Your voucher stays listed until it sells or expires. You can remove it at any time from your dashboard. There are no listing fees.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Can I sell partially used vouchers?</h3>
                <p className="text-muted-foreground">
                  No, we only accept unused vouchers with their full face value intact. The voucher must not have been redeemed or partially used.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">How do I get paid?</h3>
                <p className="text-muted-foreground">
                  Payment is made via EFT to your bank account 5-7 business days after the buyer confirms successful redemption. You'll receive a payment notification email.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">What happens if the voucher is invalid?</h3>
                <p className="text-muted-foreground">
                  If a buyer reports that your voucher is invalid or already used, we will investigate. Fraudulent listings may result in account suspension and legal action.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Can I edit my listing after submission?</h3>
                <p className="text-muted-foreground">
                  Once submitted, listings cannot be edited. However, you can remove the listing and create a new one if needed before it's purchased.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button
                onClick={() => setShowFAQ(false)}
                className="w-full btn-primary"
              >
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
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
