import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('isFeatured');
    const isTrending = searchParams.get('isTrending');
    const isOrganic = searchParams.get('isOrganic');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { nameBn: { contains: search } },
        { nameEn: { contains: search } },
        { descriptionBn: { contains: search } },
        { descriptionEn: { contains: search } },
      ];
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isTrending === 'true') {
      where.isTrending = true;
    }

    if (isOrganic === 'true') {
      where.isOrganic = true;
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.price = priceFilter;
    }

    // Build orderBy
    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              nameBn: true,
              nameEn: true,
              slug: true,
              icon: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    // Parse images JSON strings and calculate discount prices
    const enrichedProducts = products.map((product) => {
      const { images, ...rest } = product;
      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse(images);
      } catch {
        parsedImages = [];
      }

      const discountedPrice =
        product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

      return {
        ...rest,
        images: parsedImages,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
      };
    });

    return NextResponse.json({
      products: enrichedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nameBn,
      nameEn,
      slug,
      price,
      stock = 0,
      discount = 0,
      unit = 'kg',
      categoryId,
      descriptionBn,
      descriptionEn,
      originalPrice,
      isOrganic = false,
      isFeatured = false,
      isTrending = false,
    } = body;

    if (!nameBn || !nameEn || !slug || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: nameBn, nameEn, slug, price, categoryId' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await db.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        nameBn,
        nameEn,
        slug,
        price: parseFloat(String(price)),
        stock: parseInt(String(stock), 10),
        discount: parseInt(String(discount), 10),
        unit,
        categoryId,
        descriptionBn: descriptionBn || null,
        descriptionEn: descriptionEn || null,
        originalPrice: originalPrice ? parseFloat(String(originalPrice)) : null,
        isOrganic,
        isFeatured,
        isTrending,
        images: '[]',
      },
      include: {
        category: {
          select: {
            id: true,
            nameBn: true,
            nameEn: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
