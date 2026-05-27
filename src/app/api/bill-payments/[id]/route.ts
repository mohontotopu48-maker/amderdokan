import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/bill-payments/[id] - Get single bill payment details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payment = await db.billPayment.findUnique({
      where: { id },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Bill payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error fetching bill payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bill payment' },
      { status: 500 }
    )
  }
}

// PATCH /api/bill-payments/[id] - Update bill payment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Missing required field: status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'completed', 'failed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const payment = await db.billPayment.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error updating bill payment:', error)
    return NextResponse.json(
      { error: 'Failed to update bill payment' },
      { status: 500 }
    )
  }
}
