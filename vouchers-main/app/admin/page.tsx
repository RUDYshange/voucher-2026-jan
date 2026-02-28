"use client"

import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"

interface Voucher {
  id: string;
  voucherId: string;
  seller: string;
  brand: string;
  value: number;
  status: string;
  uploadDate: string;
  description: string;
  voucherImage: string | null;
  proofImage: string | null;
  isSubmission: boolean;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminPage() {
  const { toasts, showToast } = useToast()
  const [filter, setFilter] = useState("all")
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })

  useEffect(() => {
    fetchVouchers();
  }, [])

  const fetchVouchers = () => {
    fetch('/api/admin/vouchers')
      .then(res => res.json())
      .then((data: Voucher[]) => {
        setVouchers(data);
        const newStats = {
          total: data.length,
          pending: data.filter(v => v.status === "pending").length,
          approved: data.filter(v => v.status === "approved").length,
          rejected: data.filter(v => v.status === "rejected").length,
        };
        setStats(newStats);
      })
      .catch(error => console.error("Failed to fetch vouchers:", error));
  };

  const filteredVouchers = useMemo(() => {
    if (filter === "all") {
      return vouchers;
    }
    return vouchers.filter((v) => v.status === filter);
  }, [vouchers, filter]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/vouchers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      showToast(`Voucher ${id} approved successfully!`, "success");
      fetchVouchers(); // Re-fetch to update UI
    } catch (error) {
      console.error("Failed to approve voucher:", error);
      showToast("Failed to approve voucher", "error");
    }
  }

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/admin/vouchers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      showToast(`Voucher ${id} rejected. Seller notified.`, "info");
      fetchVouchers(); // Re-fetch to update UI
    } catch (error) {
      console.error("Failed to reject voucher:", error);
      showToast("Failed to reject voucher", "error");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage voucher verification queue</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Pending</p>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-success">{stats.approved}</p>
              <p className="text-xs text-muted-foreground mt-2">This week</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Rejected</p>
              <p className="text-3xl font-bold text-danger">{stats.rejected}</p>
              <p className="text-xs text-muted-foreground mt-2">Failed verification</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Processed</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="card mb-6">
            <div className="flex gap-4 flex-wrap">
              {[
                { id: "all", label: "All", count: stats.total },
                { id: "pending", label: "Pending", count: stats.pending },
                { id: "approved", label: "Approved", count: stats.approved },
                { id: "rejected", label: "Rejected", count: stats.rejected },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    filter === tab.id ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Verification Queue Table */}
          <div className="card overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Voucher ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Seller</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Brand</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Value</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((voucher, idx) => (
                    <tr
                      key={voucher.id}
                      className={`border-b border-border hover:bg-muted/50 transition ${
                        voucher.status === "pending" ? "bg-warning/5" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-foreground font-mono text-sm">{voucher.voucherId}</td>
                      <td className="py-4 px-6 text-foreground">{voucher.seller}</td>
                      <td className="py-4 px-6 text-foreground font-semibold">{voucher.brand}</td>
                      <td className="py-4 px-6 text-foreground">R{voucher.value}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`badge ${
                            voucher.status === "pending"
                              ? "bg-warning/10 text-warning"
                              : voucher.status === "approved"
                                ? "badge-success"
                                : "bg-danger/10 text-danger"
                          }`}
                        >
                          {voucher.status === "approved"
                            ? "✓ Approved"
                            : voucher.status === "rejected"
                              ? "✗ Rejected"
                              : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{voucher.uploadDate}</td>
                      <td className="py-4 px-6">
                        {voucher.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(voucher.id)}
                              className="px-3 py-1 rounded text-white bg-success hover:bg-success/90 text-sm transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(voucher.id)}
                              className="px-3 py-1 rounded text-white bg-danger hover:bg-danger/90 text-sm transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="text-primary hover:underline text-sm">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expandable Details Example */}
          <div className="card mt-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Quick Review</h2>

            {filteredVouchers
              .filter((v) => v.status === "pending")
              .slice(0, 1)
              .map((voucher) => (
                <div key={voucher.id} className="border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Voucher ID</p>
                      <p className="font-mono text-sm text-foreground">{voucher.voucherId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Seller</p>
                      <p className="font-semibold text-foreground">{voucher.seller}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Value</p>
                      <p className="text-2xl font-bold text-primary">R{voucher.value}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Description</p>
                    <p className="text-foreground">{voucher.description}</p>
                  </div>

                  {/* Images submitted by seller — stored in Prisma only upon approval */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-2">Voucher Image</p>
                      {voucher.voucherImage ? (
                        <>
                          <img
                            src={voucher.voucherImage}
                            alt="Voucher"
                            className="w-full rounded-lg border border-border object-contain max-h-48"
                          />
                          <a
                            href={voucher.voucherImage}
                            download={`voucher-${voucher.voucherId}.png`}
                            className="mt-2 inline-block w-full text-center py-2 px-4 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition"
                          >
                            ↓ Download Voucher Image
                          </a>
                        </>
                      ) : (
                        <div className="w-full h-48 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-2">Proof of Purchase</p>
                      {voucher.proofImage ? (
                        <>
                          <img
                            src={voucher.proofImage}
                            alt="Proof of Purchase"
                            className="w-full rounded-lg border border-border object-contain max-h-48"
                          />
                          <a
                            href={voucher.proofImage}
                            download={`proof-${voucher.voucherId}.png`}
                            className="mt-2 inline-block w-full text-center py-2 px-4 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition"
                          >
                            ↓ Download Proof of Purchase
                          </a>
                        </>
                      ) : (
                        <div className="w-full h-48 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(voucher.id)}
                      className="flex-1 px-6 py-3 rounded-lg bg-success text-white font-bold hover:bg-success/90 transition"
                    >
                      ✓ Approve Voucher
                    </button>
                    <button
                      onClick={() => handleReject(voucher.id)}
                      className="flex-1 px-6 py-3 rounded-lg bg-danger text-white font-bold hover:bg-danger/90 transition"
                    >
                      ✗ Reject & Notify
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
