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

    const orderItems = await prisma.orderItem.findMany({
      where: {
        voucher: {
          sellerId: userId,
        },
      },
      select: {
        orderId: true,
      },
      distinct: ['orderId'], // Get unique order IDs
    });

    const orderIds = orderItems.map(item => item.orderId);

    const payouts = await prisma.payment.findMany({
      where: {
        orderId: {
          in: orderIds,
        },
      },
      include: {
        order: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    const formattedPayouts = payouts.map(payout => ({
      id: payout.id,
      date: payout.order?.createdAt.toISOString().split('T')[0] || 'N/A',
      amount: payout.amount,
      status: payout.status.toLowerCase(),
      method: payout.provider,
    }));


    return NextResponse.json(formattedPayouts, { status: 200 })
  } catch (error) {
    console.error('Get user payouts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
