import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Pending: from VoucherSubmission staging table (includes images for review)
    const submissions = await prisma.voucherSubmission.findMany({
      include: { seller: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })

    // Processed: from Voucher table (approved/rejected by admin)
    const processed = await prisma.voucher.findMany({
      include: { seller: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const pendingRows = submissions.map((s) => ({
      id: s.id,
      voucherId: s.id,
      seller: s.seller.fullName,
      brand: s.outlet,
      value: s.faceValue,
      status: 'pending',
      uploadDate: s.createdAt.toISOString().split('T')[0],
      description: s.description || `${s.outlet} voucher – R${s.faceValue}`,
      voucherImage: s.voucherImage,
      proofImage: s.proofImage,
      isSubmission: true,
    }))

    const processedRows = processed.map((v) => ({
      id: v.id,
      voucherId: v.id,
      seller: v.seller.fullName,
      brand: v.outlet,
      value: v.faceValue,
      status: v.status.toLowerCase(),
      uploadDate: v.createdAt.toISOString().split('T')[0],
      description: v.description || `${v.outlet} voucher – R${v.faceValue}`,
      voucherImage: v.voucherImage ?? null,
      proofImage: v.proofImage ?? null,
      isSubmission: false,
    }))

    return NextResponse.json([...pendingRows, ...processedRows], { status: 200 })
  } catch (error) {
    console.error('Get admin vouchers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
