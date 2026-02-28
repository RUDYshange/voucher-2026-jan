import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sellerEmail,
      outlet,
      faceValue,
      voucherType,
      expiryDate,
      description,
      voucherImage,
      proofImage,
    } = body

    if (!sellerEmail || !outlet || !faceValue || !expiryDate || !voucherImage || !proofImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Look up the seller by email
    const seller = await prisma.user.findUnique({ where: { email: sellerEmail } })
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    const face = parseFloat(faceValue)
    const salePrice = Math.round(face * 0.9)
    const sellerPayout = Math.round(face * 0.7)

    // Store submission in staging table – images are held here until admin approves
    const submission = await prisma.voucherSubmission.create({
      data: {
        outlet,
        faceValue: face,
        salePrice,
        sellerPayout,
        voucherType: voucherType || 'Digital Code',
        expiryDate,
        description: description || null,
        voucherImage,
        proofImage,
        sellerId: seller.id,
      },
    })

    return NextResponse.json(
      { message: 'Voucher submitted for review', submissionId: submission.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submit voucher error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
