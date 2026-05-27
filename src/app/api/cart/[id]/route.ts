import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required (minimum 1)' },
        { status: 400 }
      );
    }

    // Check if cart item exists
    const existingItem = await db.cartItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (existingItem.product.stock < quantity) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          availableStock: existingItem.product.stock,
        },
        { status: 400 }
      );
    }

    const cartItem = await db.cartItem.update({
      where: { id },
      data: { quantity },
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

    const discountedPrice =
      cartItem.product.discount > 0
        ? cartItem.product.price * (1 - cartItem.product.discount / 100)
        : cartItem.product.price;

    const itemTotal = discountedPrice * cartItem.quantity;

    return NextResponse.json({
      cartItem,
      itemTotal: Math.round(itemTotal * 100) / 100,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if cart item exists
    const existingItem = await db.cartItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await db.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
