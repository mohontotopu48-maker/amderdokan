import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/admin/coupons - Get all coupons
export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
