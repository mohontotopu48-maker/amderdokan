import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders - Get orders for a user or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
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
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    // Parse product images in order items
    const enrichedOrders = orders.map((order) => ({
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
    }));

    return NextResponse.json({
      orders: enrichedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      deliveryAddress,
      deliveryPhone,
      paymentMethod = 'cod',
      couponCode,
      notes,
    } = body;

    if (!userId || !items || !items.length || !deliveryAddress || !deliveryPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, items, deliveryAddress, deliveryPhone' },
        { status: 400 }
      );
    }

    // Validate products and get prices
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingIds = productIds.filter((id: string) => !foundIds.has(id));
      return NextResponse.json(
        { error: 'Some products not found or unavailable', missingProducts: missingIds },
        { status: 400 }
      );
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product && product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.nameEn}`,
            productId: product.id,
            availableStock: product.stock,
          },
          { status: 400 }
        );
      }
    }

    // Calculate order totals
    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    const orderItemsData = items.map((item: { productId: string; quantity: number }) => {
      const product = productMap.get(item.productId)!;
      const discountedPrice =
        product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;
      const price = Math.round(discountedPrice * 100) / 100;
      totalAmount += price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        unit: product.unit,
      };
    });

    totalAmount = Math.round(totalAmount * 100) / 100;

    // Check coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (!coupon.expiresAt || coupon.expiresAt > now) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            if (totalAmount >= coupon.minOrder) {
              if (coupon.discountType === 'percentage') {
                discountAmount = totalAmount * (coupon.discount / 100);
                if (coupon.maxDiscount) {
                  discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                }
              } else {
                discountAmount = coupon.discount;
              }
              discountAmount = Math.round(discountAmount * 100) / 100;

              // Increment coupon usage
              await db.coupon.update({
                where: { code: couponCode },
                data: { usedCount: { increment: 1 } },
              });
            }
          }
        }
      }
    }

    const deliveryFee = totalAmount > 500 ? 0 : 60;
    const finalAmount = Math.round((totalAmount - discountAmount + deliveryFee) * 100) / 100;

    // Clear cart items for this user
    const cartProductIds = items.map((item: { productId: string }) => item.productId);

    // Create order and update stock in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          discountAmount,
          deliveryFee,
          finalAmount,
          paymentMethod,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          deliveryAddress,
          deliveryPhone,
          couponCode,
          notes,
          items: {
            create: orderItemsData,
          },
        },
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

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Remove purchased items from cart
      await tx.cartItem.deleteMany({
        where: {
          userId,
          productId: { in: cartProductIds },
        },
      });

      return newOrder;
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

    return NextResponse.json({ order: enrichedOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
