import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/stats - Dashboard statistics
export async function GET() {
  try {
    // Get total counts
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      categoryDistribution,
    ] = await Promise.all([
      // Total active products
      db.product.count({ where: { isActive: true } }),

      // Total orders
      db.order.count(),

      // Total active users
      db.user.count({ where: { isActive: true } }),

      // Total revenue (from delivered orders)
      db.order.aggregate({
        where: { orderStatus: 'delivered' },
        _sum: { finalAmount: true },
      }),

      // Recent 5 orders
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          items: {
            select: {
              id: true,
              nameBn: true,
              nameEn: true,
              quantity: true,
              price: true,
            },
          },
        },
      }),

      // Category distribution (product count per category)
      db.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
          slug: true,
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        orderBy: { order: 'asc' },
      }),
    ]);

    // Order status counts
    const orderStatusCounts = await db.order.groupBy({
      by: ['orderStatus'],
      _count: { orderStatus: true },
    });

    const ordersByStatus: Record<string, number> = {};
    for (const stat of orderStatusCounts) {
      ordersByStatus[stat.orderStatus] = stat._count.orderStatus;
    }

    // Payment status counts
    const paymentStatusCounts = await db.order.groupBy({
      by: ['paymentStatus'],
      _count: { paymentStatus: true },
    });

    const paymentsByStatus: Record<string, number> = {};
    for (const stat of paymentStatusCounts) {
      paymentsByStatus[stat.paymentStatus] = stat._count.paymentStatus;
    }

    // Format category distribution
    const formattedCategories = categoryDistribution.map((cat) => ({
      id: cat.id,
      nameBn: cat.nameBn,
      nameEn: cat.nameEn,
      slug: cat.slug,
      productCount: cat._count.products,
    }));

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
      totalUsers,
      ordersByStatus,
      paymentsByStatus,
      recentOrders,
      categoryDistribution: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
