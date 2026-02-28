"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

interface Voucher {
  id: string;
  outlet: string;
  faceValue: number;
  status: string;
  createdAt: string;
  brand: string;
}

interface Sale {
  id: string;
  buyer: string;
  brand: string;
  value: number;
  date: string;
  amount: number;
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
}

interface Stats {
  totalListings: number;
  totalSales: number;
  totalEarnings: number;
  pendingPayout: number;
}

export default function DashboardPage() {
  const { isSignedIn, userEmail, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("my-vouchers")
  const [isLoading, setIsLoading] = useState(true)

  const [myVouchers, setMyVouchers] = useState<Voucher[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    totalSales: 0,
    totalEarnings: 0,
    pendingPayout: 0,
  })

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    } else {
      setIsLoading(false)
      // TODO: Replace with actual userId from authentication context
      const userId = "clyr0315m0000r39g6j12p1j5" 

      // Fetch user's vouchers
      fetch(`/api/user/vouchers?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setMyVouchers(data.map((v: any) => ({
            id: v.id,
            brand: v.outlet, // Assuming outlet is the brand for display
            value: v.faceValue,
            status: v.status.toLowerCase(),
            createdAt: new Date(v.createdAt).toLocaleDateString(),
          })))
        })
        .catch((error) => console.error("Failed to fetch user vouchers:", error))

      // Fetch user's sales
      fetch(`/api/user/sales?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setSales(data)
        })
        .catch((error) => console.error("Failed to fetch user sales:", error))

      // Fetch user's payouts
      fetch(`/api/user/payouts?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setPayouts(data)
        })
        .catch((error) => console.error("Failed to fetch user payouts:", error))

      // Fetch user's stats
      fetch(`/api/user/stats?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data)
        })
        .catch((error) => console.error("Failed to fetch user stats:", error))
    }
  }, [isSignedIn, router])

  if (isLoading || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your account overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Listings</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalListings}</p>
              <p className="text-xs text-muted-foreground mt-2">Approved & waiting for buyers</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Sales This Month</p>
              <p className="text-3xl font-bold text-primary">{stats.totalSales}</p>
              <p className="text-xs text-muted-foreground mt-2">Vouchers purchased by buyers</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-success">R{stats.totalEarnings}</p>
              <p className="text-xs text-muted-foreground mt-2">From completed sales only</p>
            </div>

            <div className="card bg-primary/5 border border-primary/20">
              <p className="text-muted-foreground text-sm mb-2">Pending Payout</p>
              <p className="text-3xl font-bold text-primary">R{stats.pendingPayout}</p>
              <p className="text-xs text-muted-foreground mt-2">From sold vouchers</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="flex gap-8 border-b border-border mb-6 flex-wrap">
              {[
                { id: "my-vouchers", label: "My Vouchers" },
                { id: "sales", label: "Sales" },
                { id: "payouts", label: "Payouts" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 font-semibold transition border-b-2 ${
                    activeTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {/* My Vouchers Tab */}
              {activeTab === "my-vouchers" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Your Listed Vouchers</h2>
                    <Link href="/upload" className="btn-primary text-sm">
                      + Upload New Voucher
                    </Link>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-muted-foreground">
                      You will earn 70% of the face value when a buyer purchases your voucher.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Value</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Uploaded</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myVouchers.length > 0 ? (
                          myVouchers.map((voucher) => (
                            <tr key={voucher.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-4 px-4 text-foreground font-semibold">{voucher.brand}</td>
                              <td className="py-4 px-4 text-foreground">R{voucher.value}</td>
                              <td className="py-4 px-4">
                                <span
                                  className={`badge ${
                                    voucher.status === "approved" ? "badge-success" : "bg-warning/10 text-warning"
                                  }`}
                                >
                                  {voucher.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-muted-foreground text-sm">{voucher.createdAt}</td>
                              <td className="py-4 px-4">
                                <button className="text-primary hover:underline text-sm">View</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No vouchers listed yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sales Tab */}
              {activeTab === "sales" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Recent Sales</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Buyer</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Value</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">You Received</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.length > 0 ? (
                          sales.map((sale) => (
                            <tr key={sale.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-4 px-4 text-foreground font-semibold">{sale.buyer}</td>
                              <td className="py-4 px-4 text-foreground">{sale.brand}</td>
                              <td className="py-4 px-4 text-foreground">R{sale.value}</td>
                              <td className="py-4 px-4 text-success font-semibold">R{sale.amount}</td>
                              <td className="py-4 px-4 text-muted-foreground text-sm">{sale.date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-muted-foreground">
                              No sales yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payouts Tab */}
              {activeTab === "payouts" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Payout History</h2>

                  <div className="space-y-4">
                    {payouts.length > 0 ? (
                      payouts.map((payout) => (
                        <div
                          key={payout.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                        >
                          <div>
                            <p className="font-semibold text-foreground">R{payout.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              {payout.date} • {payout.method}
                            </p>
                          </div>
                          <span className="badge badge-success">{payout.status}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No payout history.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Pending Payout: </span>R{stats.pendingPayout}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Will be processed to your bank account within 5-7 business days
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Account Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Email Address</p>
                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Phone Number</p>
                        <p className="text-sm text-muted-foreground">+27 123 456 7890</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Bank Account</p>
                        <p className="text-sm text-muted-foreground">••• ••• 1234</p>
                      </div>
                      <button className="btn-outline text-sm">Update</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button onClick={handleSignOut} className="btn-outline text-danger">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

