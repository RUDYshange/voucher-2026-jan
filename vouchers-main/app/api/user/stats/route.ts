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

    // Total Listings
    const totalListings = await prisma.voucher.count({
      where: { sellerId: userId },
    });

    // Sales and Earnings
    const salesData = await prisma.orderItem.aggregate({
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      },
      where: {
        voucher: {
          sellerId: userId,
        },
      },
    });

    const totalSales = salesData._count.id;
    const totalEarnings = salesData._sum.price || 0;
    
    // Pending Payout
    const pendingPayoutData = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
            status: 'PENDING',
            order: {
                items: {
                    some: {
                        voucher: {
                            sellerId: userId,
                        }
                    }
                }
            }
        }
    });

    const pendingPayout = pendingPayoutData._sum.amount || 0;

    return NextResponse.json({
      totalListings,
      totalSales,
      totalEarnings,
      pendingPayout,
    }, { status: 200 })
  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
