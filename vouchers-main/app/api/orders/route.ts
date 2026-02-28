import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {
            userId,
            items,
            customerName,
            customerEmail,
            customerPhone,
            totalAmount
        } = body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 })
        }

        if (!customerEmail || !customerName) {
            return NextResponse.json({ error: 'Missing customer details' }, { status: 400 })
        }

        // Create the order with items in a transaction
        const order = await prisma.order.create({
            data: {
                userId: userId || null,
                customerName,
                customerEmail,
                customerPhone: customerPhone || '',
                totalAmount: Number(totalAmount),
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        voucherId: item.voucherId,
                        quantity: Number(item.quantity) || 1,
                        price: Number(item.price)
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        voucher: true
                    }
                },
                payment: true
            }
        })

        return NextResponse.json({ success: true, order }, { status: 201 })

    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json(
            { error: 'Failed to create order', details: (error as Error).message },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')
        const email = searchParams.get('email')

        if (!userId && !email) {
            // If no filter, maybe return empty or all (if admin)?
            // For security with no auth middleware, let's require at least one filter.
            return NextResponse.json({ error: 'UserId or Email required' }, { status: 400 })
        }

        const where: any = {}
        if (userId) where.userId = userId
        if (email) where.customerEmail = email

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        voucher: true
                    }
                },
                payment: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error('Fetch orders error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
