import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (session.user.role === 'BUYER') where.buyerId = session.user.id;

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: { select: { fullName: true, companyName: true } },
        items: { include: { product: true } },
        quotation: { select: { quotationNumber: true, sellerId: true, seller: { select: { companyName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Seller: filter by orders whose quotation was assigned to them
    let filtered = orders;
    if (session.user.role === 'SELLER') {
      filtered = orders.filter((o) => o.quotation?.sellerId === session.user.id);
    }

    return NextResponse.json(serializeForJSON(filtered));
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
