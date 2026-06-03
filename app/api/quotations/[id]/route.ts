import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';

export async function GET(
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
      include: {
        buyer: { select: { fullName: true, companyName: true, email: true } },
        seller: { select: { fullName: true, companyName: true, email: true } },
        items: { include: { product: true } },
      },
    });

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json(serializeForJSON(quotation));
  } catch (error) {
    console.error('GET /api/quotations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.quotationRequest.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const role = session.user.role;

    // Role-based status transitions
    if (role === 'SELLER') {
      if (existing.status !== 'SUBMITTED') {
        return NextResponse.json({ error: 'Can only respond to SUBMITTED quotations' }, { status: 400 });
      }

      // Seller can set custom pricing per item
      if (body.sellerPricing && Array.isArray(body.sellerPricing)) {
        for (const pricing of body.sellerPricing) {
          await prisma.quotationItem.update({
            where: { id: pricing.itemId },
            data: {
              sellerUnitPricePaise: BigInt(pricing.unitPricePaise),
              sellerTotalPaise: BigInt(pricing.totalPaise),
            },
          });
        }
      }

      await prisma.quotationRequest.update({
        where: { id },
        data: {
          status: 'SELLER_QUOTED',
          reviewedAt: new Date(),
        },
      });
    } else if (role === 'BUYER') {
      if (existing.status !== 'SELLER_QUOTED') {
        return NextResponse.json({ error: 'Can only respond to SELLER_QUOTED quotations' }, { status: 400 });
      }

      const newStatus = body.status;
      if (!['BUYER_ACCEPTED', 'REJECTED'].includes(newStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      await prisma.quotationRequest.update({
        where: { id },
        data: { status: newStatus },
      });
    } else if (role === 'ADMIN') {
      // Admin can update any status and add notes
      const updateData: Record<string, unknown> = {};
      if (body.status) updateData.status = body.status;
      if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

      await prisma.quotationRequest.update({
        where: { id },
        data: updateData,
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Quotation',
        entityId: id,
        oldValue: { status: existing.status },
        newValue: { status: body.status || 'SELLER_QUOTED', role },
      },
    });

    const updated = await prisma.quotationRequest.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        buyer: { select: { fullName: true, companyName: true } },
        seller: { select: { fullName: true, companyName: true } },
      },
    });

    return NextResponse.json(serializeForJSON(updated));
  } catch (error) {
    console.error('PUT /api/quotations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
