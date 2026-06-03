import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';
import Decimal from 'decimal.js';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const quotation = await prisma.quotationRequest.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    if (quotation.status !== 'BUYER_ACCEPTED') {
      return NextResponse.json({ error: 'Only BUYER_ACCEPTED quotations can be converted' }, { status: 400 });
    }

    // Check stock availability
    for (const item of quotation.items) {
      const product = item.product;
      const requested = new Decimal(item.storageQuantity.toString());
      const available = new Decimal(product.stockQuantity.toString());

      if (requested.gt(available)) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${available}, Requested: ${requested}` },
          { status: 400 }
        );
      }
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Use transaction for atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          quotationId: id,
          buyerId: quotation.buyerId,
          status: 'PENDING',
          subtotalPaise: quotation.subtotalPaise || BigInt(0),
          taxAmountPaise: quotation.taxAmountPaise || BigInt(0),
          totalPaise: quotation.totalPaise || BigInt(0),
          paymentStatus: 'PENDING',
          items: {
            create: quotation.items.map((item) => ({
              productId: item.productId,
              quantity: item.storageQuantity,
              unit: item.storageUnit,
              unitPricePaise: item.sellerUnitPricePaise || item.unitPricePaise,
              totalPricePaise: item.sellerTotalPaise || item.totalPricePaise,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Deduct inventory
      for (const item of quotation.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.storageQuantity,
            },
          },
        });
      }

      // Update quotation status
      await tx.quotationRequest.update({
        where: { id },
        data: { status: 'CONVERTED_TO_ORDER' },
      });

      return newOrder;
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CONVERT_TO_ORDER',
        entity: 'Order',
        entityId: order.id,
        orderId: order.id,
        newValue: { orderNumber, quotationId: id, totalPaise: order.totalPaise.toString() },
      },
    });

    return NextResponse.json(serializeForJSON(order), { status: 201 });
  } catch (error) {
    console.error('POST /api/quotations/[id]/convert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
