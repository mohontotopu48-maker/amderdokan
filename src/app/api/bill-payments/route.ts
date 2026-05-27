import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/bill-payments - List bill payment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (userId) {
      where.userId = userId
    }
    if (type) {
      where.type = type
    }
    if (status) {
      where.status = status
    }

    const [payments, total] = await Promise.all([
      db.billPayment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.billPayment.count({ where }),
    ])

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching bill payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bill payments' },
      { status: 500 }
    )
  }
}

// POST /api/bill-payments - Create a new bill payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      providerNameBn,
      providerNameEn,
      amount,
      fee,
      totalAmount,
      customerAccount,
      customerName,
      userId,
    } = body

    if (!type || !providerNameBn || !providerNameEn || !amount || !customerAccount) {
      return NextResponse.json(
        { error: 'Missing required fields: type, providerNameBn, providerNameEn, amount, customerAccount' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['bkash_cashout', 'nagad_cashout', 'dpdc_electric']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Calculate fee if not provided
    let calculatedFee = fee ?? 0
    if (type === 'bkash_cashout') {
      calculatedFee = Math.round(amount * 0.0185 * 100) / 100 // 1.85%
    } else if (type === 'nagad_cashout') {
      calculatedFee = Math.round(amount * 0.0145 * 100) / 100 // 1.45%
    }
    // DPDC has no fee

    const payment = await db.billPayment.create({
      data: {
        type,
        providerNameBn,
        providerNameEn,
        amount,
        fee: calculatedFee,
        customerAccount,
        customerName: customerName || 'Guest',
        userId: userId || null,
        status: 'completed', // Auto-complete for demo
      },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Error creating bill payment:', error)
    return NextResponse.json(
      { error: 'Failed to create bill payment' },
      { status: 500 }
    )
  }
}
