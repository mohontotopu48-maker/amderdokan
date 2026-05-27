import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/coupons - Validate a coupon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const totalAmount = parseFloat(searchParams.get('totalAmount') || '0');

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is no longer active',
      });
    }

    // Check expiry
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has reached its usage limit',
      });
    }

    // Check minimum order amount
    if (totalAmount < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of ৳${coupon.minOrder} required`,
        minOrder: coupon.minOrder,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = totalAmount * (coupon.discount / 100);
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discount;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
      },
      discountAmount,
      finalAmount: Math.round((totalAmount - discountAmount) * 100) / 100,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Create a coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      discount,
      discountType = 'percentage',
      minOrder = 0,
      maxDiscount,
      usageLimit,
      expiresAt,
    } = body;

    if (!code || !discount) {
      return NextResponse.json(
        { error: 'Coupon code and discount are required' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await db.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    if (discountType === 'percentage' && (discount < 1 || discount > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount,
        discountType,
        minOrder,
        maxDiscount,
        usageLimit,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
