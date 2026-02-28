import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: {
        outlet: params.name,
        status: 'APPROVED'
      }
    })

    return NextResponse.json(vouchers, { status: 200 })
  } catch (error) {
    console.error('Get vouchers by retailer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
