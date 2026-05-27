import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.review.count({ where: { productId } }),
    ]);

    // Calculate rating distribution
    const ratingStats = await db.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
    });

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let totalRating = 0;
    let totalReviews = 0;

    for (const stat of ratingStats) {
      ratingDistribution[stat.rating] = stat._count.rating;
      totalRating += stat.rating * stat._count.rating;
      totalReviews += stat._count.rating;
    }

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    return NextResponse.json({
      reviews,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        distribution: ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, rating, comment } = body;

    if (!userId || !productId || !rating) {
      return NextResponse.json(
        { error: 'userId, productId, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review and update product rating
    const review = await db.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          userId,
          productId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Recalculate product average rating
      const stats = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count.rating,
        },
      });

      return newReview;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
