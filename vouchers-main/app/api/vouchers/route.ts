/**
 * Vouchers API Route
 * 
 * GET /api/vouchers
 * 
 * Retrieves all approved vouchers from the database.
 * Includes seller information for each voucher.
 * Used by the browse vouchers page and voucher listings.
 * 
 * Query parameters: None
 * 
 * Success response (200):
 * ```json
 * [
 *   {
 *     "id": 1,
 *     "brand": "Takealot",
 *     "faceValue": 500,
 *     "status": "APPROVED",
 *     "seller": {
 *       "id": 1,
 *       "email": "seller@example.com"
 *     }
 *   }
 * ]
 * ```
 * 
 * Error response (500): Internal server error
 * 
 * @see prisma - Database client
 * @see Voucher model - Schema definition
 */

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Handle GET request for approved vouchers
 * 
 * @returns {Promise<NextResponse>} JSON array of approved vouchers with seller info
 */
export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { status: 'APPROVED' },
      include: { seller: true }
    })
    return NextResponse.json(vouchers, { status: 200 })
  } catch (error) {
    console.error('Get vouchers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
