import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Find the pending submission
    const submission = await prisma.voucherSubmission.findUnique({
      where: { id: params.id },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (status === 'APPROVED') {
      // Only on approval: create permanent Voucher record with images
      const voucher = await prisma.voucher.create({
        data: {
          outlet: submission.outlet,
          faceValue: submission.faceValue,
          salePrice: submission.salePrice,
          sellerPayout: submission.sellerPayout,
          category: submission.outlet,
          voucherType: submission.voucherType,
          expiryDate: submission.expiryDate,
          description: submission.description,
          voucherImage: submission.voucherImage,
          proofImage: submission.proofImage,
          status: 'APPROVED',
          sellerId: submission.sellerId,
        },
      })

      // Remove from staging table
      await prisma.voucherSubmission.delete({ where: { id: params.id } })

      return NextResponse.json({ message: 'Voucher approved', voucher }, { status: 200 })
    }

    if (status === 'REJECTED') {
      // On rejection: remove from staging table without storing images in Voucher
      await prisma.voucherSubmission.delete({ where: { id: params.id } })

      return NextResponse.json({ message: 'Voucher rejected and submission removed' }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  } catch (error) {
    console.error('Update voucher status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
