import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: { select: { fullName: true, companyName: true, email: true } },
        items: { include: { product: true } },
        quotation: { include: { seller: { select: { fullName: true, companyName: true } } } },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(serializeForJSON(order));
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};

    if (body.status) {
      // Buyer can only cancel pending orders
      if (session.user.role === 'BUYER') {
        if (order.status !== 'PENDING' || body.status !== 'CANCELLED') {
          return NextResponse.json({ error: 'Can only cancel PENDING orders' }, { status: 400 });
        }
      }

      // Seller/Admin: validate forward progression (or cancel)
      if (body.status !== 'CANCELLED') {
        const currentIdx = STATUS_FLOW.indexOf(order.status);
        const newIdx = STATUS_FLOW.indexOf(body.status);
        if (newIdx <= currentIdx) {
          return NextResponse.json({ error: 'Cannot move status backwards' }, { status: 400 });
        }
      }

      updateData.status = body.status;
    }

    if (body.paymentStatus) {
      updateData.paymentStatus = body.paymentStatus;
    }

    const updated = await prisma.order.update({ where: { id }, data: updateData });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Order',
        entityId: id,
        orderId: id,
        oldValue: { status: order.status, paymentStatus: order.paymentStatus },
        newValue: updateData as any,
      },
    });

    return NextResponse.json(serializeForJSON(updated));
  } catch (error) {
    console.error('PUT /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
