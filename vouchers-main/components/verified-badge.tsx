/**
 * Verified Badge Component
 * 
 * Displays a badge indicating that a voucher has been verified by admin.
 * Shows a checkmark icon with optional "Verified" text label.
 * Used to build trust with users.
 * 
 * @component
 * @param {VerifiedBadgeProps} props - Component props
 * @returns {JSX.Element} A styled verification badge
 */

interface VerifiedBadgeProps {
  /**
   * Size of the badge: sm (small), md (medium), lg (large)
   * @default "md"
   */
  size?: "sm" | "md" | "lg"
  /**
   * Whether to display the "Verified" text or just the checkmark
   * @default true
   */
  showText?: boolean
}

/**
 * VerifiedBadge Component
 * 
 * Renders a success badge with a checkmark to indicate verification status.
 * 
 * @param {VerifiedBadgeProps} props - Component props
 * @returns {JSX.Element} A styled badge element
 * 
 * @example
 * <VerifiedBadge size="md" showText={true} />
 */
export function VerifiedBadge({ size = "md", showText = true }: VerifiedBadgeProps) {
  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }[size]

  return (
    <div className={`badge badge-success ${sizeClass}`}>
      <span className="mr-1">✓</span>
      {showText && "Verified"}
    </div>
  )
}
