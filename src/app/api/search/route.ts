import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/search - Search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q || q.trim().length < 2) {
      return NextResponse.json({
        products: [],
        categories: [],
      });
    }

    const searchTerm = q.trim();

    // Search in products (both nameBn and nameEn)
    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { nameBn: { contains: searchTerm } },
          { nameEn: { contains: searchTerm } },
          { descriptionBn: { contains: searchTerm } },
          { descriptionEn: { contains: searchTerm } },
        ],
      },
      select: {
        id: true,
        nameBn: true,
        nameEn: true,
        slug: true,
        price: true,
        originalPrice: true,
        discount: true,
        unit: true,
        images: true,
        rating: true,
        category: {
          select: {
            nameBn: true,
            nameEn: true,
            slug: true,
          },
        },
        brand: {
          select: {
            nameBn: true,
            nameEn: true,
            slug: true,
          },
        },
      },
      take: 8,
      orderBy: { rating: 'desc' },
    });

    // Search in categories
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        OR: [
          { nameBn: { contains: searchTerm } },
          { nameEn: { contains: searchTerm } },
        ],
      },
      select: {
        id: true,
        nameBn: true,
        nameEn: true,
        slug: true,
        icon: true,
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      take: 8,
    });

    // Parse product images
    const enrichedProducts = products.map((product) => {
      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse(product.images);
      } catch {
        parsedImages = [];
      }

      const discountedPrice =
        product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

      return {
        ...product,
        images: parsedImages,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
      };
    });

    const enrichedCategories = categories.map((category) => ({
      ...category,
      productCount: category._count.products,
    }));

    return NextResponse.json({
      products: enrichedProducts,
      categories: enrichedCategories,
      query: searchTerm,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
