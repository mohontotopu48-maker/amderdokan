import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders/[id] - Get order details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                nameBn: true,
                nameEn: true,
                images: true,
                slug: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse product images in order items
    const enrichedOrder = {
      ...order,
      items: order.items.map((item) => {
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
          },
        };
      }),
    };

    return NextResponse.json({ order: enrichedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus } = body;

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate orderStatus values
    const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { error: 'Invalid order status', validStatuses: validOrderStatuses },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status', validStatuses: validPaymentStatuses },
        { status: 400 }
      );
    }

    // If order is cancelled, restore stock
    if (orderStatus === 'cancelled' && existingOrder.orderStatus !== 'cancelled') {
      const orderItems = await db.orderItem.findMany({
        where: { orderId: id },
      });

      await db.$transaction(
        orderItems.map((item) =>
          db.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        )
      );
    }

    const updateData: Record<string, string> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                nameBn: true,
                nameEn: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Parse product images in order items
    const enrichedOrder = {
      ...order,
      items: order.items.map((item) => {
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
          },
        };
      }),
    };

    return NextResponse.json({ order: enrichedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
