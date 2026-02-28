import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import VouchersPageClient from "./vouchers-page-client"
import categoriesData from "@/data/categories.json"

interface RetailerTile {
  outlet: string
  category: string
  voucherCount: number
}

export default async function VouchersPage() {
  // Fetch approved vouchers from database
  const vouchers = await prisma.voucher.findMany({
    where: { status: 'APPROVED' }
  })

  // Group vouchers by outlet
  const retailerMap = new Map<string, RetailerTile>()
  
  vouchers.forEach((voucher) => {
    if (!retailerMap.has(voucher.outlet)) {
      retailerMap.set(voucher.outlet, {
        outlet: voucher.outlet,
        category: voucher.category,
        voucherCount: 0,
      })
    }
    const retailer = retailerMap.get(voucher.outlet)!
    retailer.voucherCount += 1
  })

  const uniqueRetailers = Array.from(retailerMap.values())

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Browse Retailers</h1>
          <p className="text-muted-foreground mb-8">Select a retailer to view available vouchers and save 10%</p>
          <VouchersPageClient retailers={uniqueRetailers} categories={categoriesData} />
        </div>
      </main>
      <Footer />
    </>
  )
}
