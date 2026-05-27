import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: { products: { where: { isActive: true } } },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    const enrichedCategories = categories.map((category) => ({
      ...category,
      productCount: category._count.products,
      children: category.children.map((child) => ({
        ...child,
        productCount: child._count.products,
      })),
    }));

    return NextResponse.json({ categories: enrichedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
