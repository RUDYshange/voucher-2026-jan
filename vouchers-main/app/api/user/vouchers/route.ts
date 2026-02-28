import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const vouchers = await prisma.voucher.findMany({
      where: {
        sellerId: userId,
      },
    })

    return NextResponse.json(vouchers, { status: 200 })
  } catch (error) {
    console.error('Get user vouchers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
