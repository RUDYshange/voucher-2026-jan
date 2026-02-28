/**
 * PriceBreakdown Component
 * 
 * Displays the pricing model for vouchers showing:
 * - Face Value: The original voucher value
 * - Buyer Price: 90% of face value (what buyers pay)
 * - Seller Payout: 70% of face value (what sellers receive)
 * - Buyer Savings: The discount percentage and amount
 * 
 * Pricing Model:
 * - Buyers: Pay 90% of face value (10% discount)
 * - Sellers: Receive 70% of face value
 * - Platform Fee: 20% (difference between buyer payment and seller payout)
 * 
 * @typedef {Object} PriceBreakdownProps
 * @property {number} faceValue - The original value of the voucher in ZAR
 * @property {string} [label="Pricing Breakdown"] - Custom label for the section
 */
interface PriceBreakdownProps {
  faceValue: number
  label?: string
}

/**
 * PriceBreakdown Component
 * 
 * @param {PriceBreakdownProps} props - Component props
 * @returns {JSX.Element} A breakdown table showing all pricing information
 * 
 * @example
 * <PriceBreakdown faceValue={500} />
 */
export function PriceBreakdown({ faceValue, label = "Pricing Breakdown" }: PriceBreakdownProps) {
  const buyerPrice = Math.round(faceValue * 0.9)
  const sellerPayout = Math.round(faceValue * 0.7)
  const savings = faceValue - buyerPrice

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">{label}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Face Value</span>
          <span className="text-foreground">R{faceValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Buyer Pays (90%)</span>
          <span className="text-foreground">R{buyerPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Seller Gets (70%)</span>
          <span className="text-success font-semibold">R{sellerPayout}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Buyer Saves (10%)</span>
          <span className="text-success">R{savings}</span>
        </div>
      </div>
    </div>
  )
}
