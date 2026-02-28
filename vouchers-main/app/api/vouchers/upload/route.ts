import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      outlet,
      faceValue,
      salePrice,
      sellerPayout,
      category,
      sellerId
    } = body

    if (!outlet || !faceValue || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create voucher
    const voucher = await prisma.voucher.create({
      data: {
        outlet,
        faceValue: parseFloat(faceValue),
        salePrice: parseFloat(salePrice),
        sellerPayout: parseFloat(sellerPayout),
        category,
        sellerId,
        status: 'PENDING'
      }
    })

    return NextResponse.json(
      {
        message: 'Voucher created successfully',
        voucher
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
