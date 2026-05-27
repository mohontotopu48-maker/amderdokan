import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

// GET /api/admin/revenue - Revenue data for last 7 days
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Get all orders from the last 7 days
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        orderStatus: {
          notIn: ['cancelled'],
        },
      },
      select: {
        finalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const dailyMap: Record<string, { revenue: number; orders: number }> = {};

    // Initialize last 7 days with zeros
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dailyMap[key] = { revenue: 0, orders: 0 };
    }

    // Fill in actual data
    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      if (dailyMap[key]) {
        dailyMap[key].revenue += order.finalAmount;
        dailyMap[key].orders += 1;
      }
    }

    // Convert to array
    const daily = Object.entries(dailyMap).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric' }),
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    }));

    return NextResponse.json({ daily });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}
