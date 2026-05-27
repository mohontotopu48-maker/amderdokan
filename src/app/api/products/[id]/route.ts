import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse images JSON string
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

    return NextResponse.json({
      ...product,
      images: parsedImages,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (body.nameBn !== undefined) updateData.nameBn = body.nameBn;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.discount !== undefined) updateData.discount = body.discount;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.descriptionBn !== undefined) updateData.descriptionBn = body.descriptionBn;
    if (body.descriptionEn !== undefined) updateData.descriptionEn = body.descriptionEn;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isTrending !== undefined) updateData.isTrending = body.isTrending;
    if (body.isOrganic !== undefined) updateData.isOrganic = body.isOrganic;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;

    const product = await db.product.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft delete a product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
