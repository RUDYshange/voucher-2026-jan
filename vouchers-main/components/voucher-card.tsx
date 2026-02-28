/**
 * Voucher Card Component
 * 
 * Displays a single voucher with brand information, pricing, and expiry date.
 * Can render in two layouts: compact (for grids) or full (for featured displays).
 * Shows 10% buyer discount compared to face value.
 * Includes verification badge for verified vouchers.
 * 
 * @component
 * @see VoucherCardProps for component props
 */

import Image from "next/image"
import Link from "next/link"
import { VerifiedBadge } from "./verified-badge"

/**
 * VoucherCardProps
 * 
 * @typedef {Object} VoucherCardProps
 * @property {number} id - Unique identifier for the voucher
 * @property {string} brand - Brand name of the voucher
 * @property {string} logo - URL path to the brand logo image
 * @property {number} faceValue - Original value of the voucher in ZAR
 * @property {string} category - Category of the voucher
 * @property {string} expiryDate - ISO date string for expiry
 * @property {boolean} [verified=true] - Whether the voucher is verified
 * @property {boolean} [compact=false] - Whether to use compact layout
 */
interface VoucherCardProps {
  id: number
  brand: string
  logo: string
  faceValue: number
  category: string
  expiryDate: string
  verified?: boolean
  compact?: boolean
}

/**
 * VoucherCard Component
 * 
 * Renders a clickable card representing a single voucher.
 * - Compact mode: Shows logo, brand name, category, and buyer price
 * - Full mode: Adds face value comparison and savings information
 * 
 * @param {VoucherCardProps} props - Component props
 * @returns {JSX.Element} The voucher card element, links to /voucher/[id]
 */
export function VoucherCard({
  id,
  brand,
  logo,
  faceValue,
  category,
  expiryDate,
  verified = true,
  compact = false,
}: VoucherCardProps) {
  const buyerPrice = Math.round(faceValue * 0.9)

  if (compact) {
    return (
      <Link href={`/voucher/${id}`} className="block">
        <div className="card hover:shadow-lg hover:border-primary transition cursor-pointer">
          <div className="h-16 mb-3 flex items-center justify-center">
            <Image src={logo || "/placeholder.svg"} alt={brand} width={64} height={64} className="object-contain" />
          </div>
          <p className="font-bold text-foreground">{brand}</p>
          <p className="text-sm text-muted-foreground">{category}</p>
          <p className="text-lg font-bold text-primary mt-2">R{buyerPrice}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/voucher/${id}`} className="block">
      <div className="card hover:shadow-lg transition cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="h-20 w-20 flex items-center">
            <Image src={logo || "/placeholder.svg"} alt={brand} width={80} height={80} className="object-contain" />
          </div>
          {verified && <VerifiedBadge size="sm" />}
        </div>

        <h3 className="font-bold text-lg text-foreground mb-1">{brand}</h3>
        <p className="text-sm text-muted-foreground mb-4">{category}</p>

        <div className="mb-4">
          <p className="text-3xl font-bold text-primary mb-1">R{buyerPrice}</p>
          <p className="text-sm text-muted-foreground line-through">Regular R{faceValue}</p>
          <p className="text-sm font-semibold text-success mt-1">Save 10%</p>
        </div>

        <p className="text-sm text-muted-foreground mb-4">Expires: {new Date(expiryDate).toLocaleDateString()}</p>

        <span className="text-primary font-semibold hover:underline">View Details →</span>
      </div>
    </Link>
  )
}
