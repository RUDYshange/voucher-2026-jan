/**
 * StatsGrid Component
 * 
 * Displays statistics in a responsive grid layout.
 * Used in dashboards to show key metrics like sales, payouts, total vouchers, etc.
 * Supports responsive column counts and color-coded stat values.
 * 
 * @component
 * @param {StatsGridProps} props - Component props
 * @returns {JSX.Element} A grid of stat cards
 */

/**
 * Stat Interface
 * 
 * @typedef {Object} Stat
 * @property {string} label - The label for the statistic
 * @property {string | number} value - The main value to display
 * @property {string} [subtext] - Optional secondary text below the value
 * @property {"primary" | "success" | "warning" | "danger"} [color] - Color of the value text
 */
interface Stat {
  label: string
  value: string | number
  subtext?: string
  color?: "primary" | "success" | "warning" | "danger"
}

/**
 * StatsGridProps
 * 
 * @typedef {Object} StatsGridProps
 * @property {Stat[]} stats - Array of statistics to display
 * @property {2 | 3 | 4} [columns=4] - Number of columns in the responsive grid
 */
interface StatsGridProps {
  stats: Stat[]
  /**
   * Number of columns to display (responsive for different screen sizes)
   * @default 4
   */
  columns?: 2 | 3 | 4
}

/**
 * StatsGrid Component Implementation
 * 
 * @param {StatsGridProps} props - Component props
 * @returns {JSX.Element} A responsive grid displaying stat cards
 * 
 * @example
 * <StatsGrid
 *   stats={[
 *     { label: 'Total Sales', value: 'R5,000', color: 'success' },
 *     { label: 'Pending Payouts', value: 'R1,200' }
 *   ]}
 *   columns={2}
 * />
 */
export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns]

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6`}>
      {stats.map((stat, idx) => (
        <div key={idx} className="card">
          <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
          <p
            className={`text-3xl font-bold ${
              stat.color === "success"
                ? "text-success"
                : stat.color === "primary"
                  ? "text-primary"
                  : stat.color === "danger"
                    ? "text-danger"
                    : stat.color === "warning"
                      ? "text-warning"
                      : "text-foreground"
            }`}
          >
            {stat.value}
          </p>
          {stat.subtext && <p className="text-xs text-muted-foreground mt-2">{stat.subtext}</p>}
        </div>
      ))}
    </div>
  )
}
