import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/admin/coupons/[id] - Toggle coupon active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}
