import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const voucher = await prisma.voucher.findUnique({
      where: { id: params.id },
      include: { seller: true }
    })

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
    }

    return NextResponse.json(voucher, { status: 200 })
  } catch (error) {
    console.error('Get voucher error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    const voucher = await prisma.voucher.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json(voucher, { status: 200 })
  } catch (error) {
    console.error('Update voucher error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
