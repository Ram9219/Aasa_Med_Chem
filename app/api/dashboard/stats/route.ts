import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = session.user.role;

    if (role === 'ADMIN') {
      const [totalUsers, totalProducts, totalBuyers, totalSellers, pendingQuotations, activeOrders, lowStockProducts] =
        await Promise.all([
          prisma.user.count(),
          prisma.product.count({ where: { isActive: true } }),
          prisma.user.count({ where: { role: 'BUYER' } }),
          prisma.user.count({ where: { role: 'SELLER' } }),
          prisma.quotationRequest.count({ where: { status: { in: ['SUBMITTED', 'REVIEWED', 'SELLER_QUOTED'] } } }),
          prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } } }),
          prisma.product.count({
            where: {
              isActive: true,
              stockQuantity: { lte: prisma.product.fields?.minStockLevel ?? 0 },
            },
          }).catch(() => 0),
        ]);

      return NextResponse.json(
        serializeForJSON({ totalUsers, totalProducts, totalBuyers, totalSellers, pendingQuotations, activeOrders, lowStockProducts })
      );
    }

    if (role === 'SELLER') {
      const [myProducts, pendingQuotations, activeOrders] = await Promise.all([
        prisma.product.count({ where: { sellerId: session.user.id, isActive: true } }),
        prisma.quotationRequest.count({ where: { sellerId: session.user.id, status: 'SUBMITTED' } }),
        prisma.order.count({
          where: {
            quotation: { sellerId: session.user.id },
            status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] },
          },
        }),
      ]);

      return NextResponse.json(serializeForJSON({ myProducts, pendingQuotations, activeOrders }));
    }

    if (role === 'BUYER') {
      const [pendingQuotations, activeOrders, orders] = await Promise.all([
        prisma.quotationRequest.count({
          where: { buyerId: session.user.id, status: { in: ['SUBMITTED', 'SELLER_QUOTED'] } },
        }),
        prisma.order.count({
          where: { buyerId: session.user.id, status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } },
        }),
        prisma.order.findMany({
          where: { buyerId: session.user.id },
          select: { totalPaise: true },
        }),
      ]);

      const totalSpend = orders.reduce((sum, o) => sum + Number(o.totalPaise), 0);

      return NextResponse.json(serializeForJSON({ pendingQuotations, activeOrders, totalSpend }));
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
