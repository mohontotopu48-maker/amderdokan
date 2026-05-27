import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/cart - Get cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'guest';

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: {
              select: {
                id: true,
                nameBn: true,
                nameEn: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals for each item and overall
    const enrichedItems = cartItems.map((item) => {
      const discountedPrice =
        item.product.discount > 0
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price;

      const itemTotal = discountedPrice * item.quantity;

      let parsedImages: string[] = [];
      try {
        parsedImages = JSON.parse(item.product.images);
      } catch {
        parsedImages = [];
      }

      return {
        ...item,
        product: {
          ...item.product,
          images: parsedImages,
          discountedPrice: Math.round(discountedPrice * 100) / 100,
        },
        itemTotal: Math.round(itemTotal * 100) / 100,
      };
    });

    const subtotal = enrichedItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const totalItems = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = subtotal > 500 ? 0 : 60;
    const totalAmount = subtotal + deliveryFee;

    return NextResponse.json({
      items: enrichedItems,
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        deliveryFee,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalItems,
        itemCount: enrichedItems.length,
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'guest', productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and is in stock
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock', availableStock: product.stock },
        { status: 400 }
      );
    }

    // Check if item already exists in cart (upsert)
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock for requested quantity',
            availableStock: product.stock,
            currentCartQuantity: existingItem.quantity,
          },
          { status: 400 }
        );
      }
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: {
                select: { id: true, nameBn: true, nameEn: true, slug: true },
              },
            },
          },
        },
      });
    } else {
      cartItem = await db.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: {
                select: { id: true, nameBn: true, nameEn: true, slug: true },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ cartItem }, { status: existingItem ? 200 : 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
