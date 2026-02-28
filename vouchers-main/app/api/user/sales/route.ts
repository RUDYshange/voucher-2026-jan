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

    const sales = await prisma.orderItem.findMany({
      where: {
        voucher: {
          sellerId: userId,
        },
      },
      include: {
        voucher: {
          select: {
            outlet: true,
            faceValue: true,
            salePrice: true,
          },
        },
        order: {
          select: {
            customerName: true,
            createdAt: true,
          },
        },
      },
    })

    const formattedSales = sales.map(sale => ({
      id: sale.id,
      buyer: sale.order?.customerName || 'N/A', // Assuming customerName is the buyer
      brand: sale.voucher.outlet,
      value: sale.voucher.faceValue,
      amount: sale.price, // This is the amount the seller received (salePrice * quantity)
      date: sale.order?.createdAt.toISOString().split('T')[0] || 'N/A',
    }));


    return NextResponse.json(formattedSales, { status: 200 })
  } catch (error) {
    console.error('Get user sales error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
