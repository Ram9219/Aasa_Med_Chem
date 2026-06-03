import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';
import { calculatePrice } from '@/lib/units/conversion-engine';
import Decimal from 'decimal.js';
import { DisplayUnit } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (session.user.role === 'BUYER') {
      where.buyerId = session.user.id;
    } else if (session.user.role === 'SELLER') {
      where.sellerId = session.user.id;
    }
    // Admin sees all

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    if (status) where.status = status;

    const quotations = await prisma.quotationRequest.findMany({
      where,
      include: {
        buyer: { select: { fullName: true, companyName: true } },
        seller: { select: { fullName: true, companyName: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(serializeForJSON(quotations));
  } catch (error) {
    console.error('GET /api/quotations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BUYER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one item required' }, { status: 400 });
    }

    const quotationNumber = `QT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const processedItems = [];
    let subtotalPaise = BigInt(0);
    let sellerId: string | null = null;

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (!sellerId) sellerId = product.sellerId;

      const calc = calculatePrice(
        new Decimal(item.quantity),
        new Decimal(product.ratePerUnit.toString()),
        item.unit as DisplayUnit,
        product.storageUnit
      );

      processedItems.push({
        productId: product.id,
        requestedQuantity: item.quantity,
        requestedUnit: item.unit as DisplayUnit,
        storageQuantity: calc.storageQuantity.toString(),
        storageUnit: product.storageUnit,
        unitPricePaise: calc.unitPricePaise,
        totalPricePaise: calc.totalPaise,
      });

      subtotalPaise += calc.totalPaise;
    }

    const taxRate = new Decimal('18.00');
    const taxAmountPaise = BigInt(
      new Decimal(subtotalPaise.toString()).times(taxRate).dividedBy(100).toDecimalPlaces(0).toString()
    );
    const totalPaise = subtotalPaise + taxAmountPaise;

    const quotation = await prisma.quotationRequest.create({
      data: {
        quotationNumber,
        buyerId: session.user.id,
        sellerId,
        status: 'SUBMITTED',
        subtotalPaise,
        taxRate: taxRate.toString(),
        taxAmountPaise,
        totalPaise,
        notes: notes || null,
        submittedAt: new Date(),
        items: { create: processedItems },
      },
      include: {
        items: { include: { product: true } },
        buyer: { select: { fullName: true, companyName: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SUBMIT',
        entity: 'Quotation',
        entityId: quotation.id,
        newValue: { quotationNumber, itemCount: items.length, totalPaise: totalPaise.toString() },
      },
    });

    return NextResponse.json(serializeForJSON(quotation), { status: 201 });
  } catch (error) {
    console.error('POST /api/quotations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
