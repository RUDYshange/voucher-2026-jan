"use client"

import { useState } from "react"

export default function Footer() {
  const [showHelpCenter, setShowHelpCenter] = useState<boolean>(false)
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false)
  const [showTerms, setShowTerms] = useState<boolean>(false)
  const [showSellerFAQ, setShowSellerFAQ] = useState<boolean>(false)

  return (
    <>
      <footer className="border-t border-border bg-muted py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">VoucherTrade</h4>
              <p className="text-muted-foreground text-sm">
                Safely buy and sell digital vouchers at the best prices in South Africa.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Browse</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    All Vouchers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Trending
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Sell</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    How to Sell
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <button onClick={() => setShowSellerFAQ(true)} className="hover:text-primary">
                    Seller FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-foreground mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => setShowHelpCenter(true)} className="hover:text-primary">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="hover:text-primary">
                    Privacy
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowTerms(true)} className="hover:text-primary">
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">© 2025 VoucherTrade. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Help Center Modal */}
      {showHelpCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Help Center</h2>
              <button
                onClick={() => setShowHelpCenter(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-2">
                  Welcome to VoucherTrade! Here's how to get started:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Create an account by signing up</li>
                  <li>Browse available vouchers or list your own</li>
                  <li>Complete verification for selling vouchers</li>
                  <li>Make secure transactions through our platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Buying Vouchers</h3>
                <p className="text-muted-foreground mb-2">
                  How to purchase vouchers:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Browse available vouchers by category or provider</li>
                  <li>Select a voucher and review the details</li>
                  <li>Complete payment through our secure checkout</li>
                  <li>Receive your voucher code instantly after payment</li>
                  <li>Confirm receipt within 24 hours</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Selling Vouchers</h3>
                <p className="text-muted-foreground mb-2">
                  Steps to sell your vouchers:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Sign up and verify your account</li>
                  <li>Upload voucher image and proof of purchase</li>
                  <li>Wait for verification (usually within 24 hours)</li>
                  <li>Once approved, your voucher will be listed</li>
                  <li>Receive payment 5-7 days after sale</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Payment & Payouts</h3>
                <p className="text-muted-foreground">
                  All payments are processed securely through our platform. Buyers pay upfront, and sellers receive payouts via EFT within 5-7 business days after the buyer confirms successful receipt. We hold funds in escrow to protect both parties.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  If you encounter any issues with a transaction, contact our support team within 48 hours. We'll investigate and work to resolve the dispute fairly. Common issues include invalid voucher codes or non-receipt of codes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Account Security</h3>
                <p className="text-muted-foreground mb-2">
                  Keep your account secure:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Use a strong, unique password</li>
                  <li>Never share your login credentials</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Log out from shared devices</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">Contact Support</h3>
                <p className="text-muted-foreground">
                  Need more help? Contact our support team:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: support@vouchertrade.co.za<br />
                  Phone: +27 21 123 4567<br />
                  Hours: Monday - Friday, 9:00 AM - 5:00 PM SAST
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6">
              <button onClick={() => setShowHelpCenter(false)} className="w-full btn-primary">
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

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Terms & Conditions</h2>
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
                  By accessing and using VoucherTrade, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
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

      {/* Seller FAQ Modal */}
      {showSellerFAQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Seller FAQ</h2>
              <button
                onClick={() => setShowSellerFAQ(false)}
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
                onClick={() => setShowSellerFAQ(false)}
                className="w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
