import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

// DELETE /api/admin/reviews/[id] - Delete a review
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const review = await db.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Delete review and recalculate product rating
    await db.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id },
      });

      // Recalculate product average rating
      const stats = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
