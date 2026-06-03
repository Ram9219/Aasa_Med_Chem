import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { serializeForJSON } from '@/lib/serialize';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const casNumber = searchParams.get('casNumber');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    // Seller sees only own products
    if (session.user.role === 'SELLER') {
      where.sellerId = session.user.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { chemicalName: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { casNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (casNumber) where.casNumber = casNumber;

    const products = await prisma.product.findMany({
      where,
      include: { seller: { select: { companyName: true, fullName: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(serializeForJSON(products));
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Convert rate from rupees per display unit to paise per storage unit
    const { rateInRupees, rateDisplayUnit, stockQuantity, stockDisplayUnit, ...rest } = body;

    // Calculate paise per storage unit
    let ratePerUnit = 0;
    if (rest.storageUnit === 'mg') {
      const factor = rateDisplayUnit === 'kg' ? 1000000 : rateDisplayUnit === 'g' ? 1000 : 1;
      ratePerUnit = (rateInRupees * 100) / factor; // paise per mg
    } else if (rest.storageUnit === 'ul') {
      const factor = rateDisplayUnit === 'L' ? 1000000 : rateDisplayUnit === 'mL' ? 1000 : 1;
      ratePerUnit = (rateInRupees * 100) / factor; // paise per µL
    } else {
      ratePerUnit = rateInRupees * 100; // paise per unit
    }

    // Convert stock to storage unit
    let stockInStorageUnit = stockQuantity;
    if (rest.storageUnit === 'mg') {
      const factor = stockDisplayUnit === 'kg' ? 1000000 : stockDisplayUnit === 'g' ? 1000 : 1;
      stockInStorageUnit = stockQuantity * factor;
    } else if (rest.storageUnit === 'ul') {
      const factor = stockDisplayUnit === 'L' ? 1000000 : stockDisplayUnit === 'mL' ? 1000 : 1;
      stockInStorageUnit = stockQuantity * factor;
    }

    const product = await prisma.product.create({
      data: {
        name: rest.name,
        sku: rest.sku,
        category: rest.category,
        description: rest.description || null,
        casNumber: rest.casNumber || null,
        chemicalName: rest.chemicalName || null,
        molecularFormula: rest.molecularFormula || null,
        molecularWeight: rest.molecularWeight || null,
        purity: rest.purity || null,
        grade: rest.grade || null,
        manufacturer: rest.manufacturer || null,
        batchNumber: rest.batchNumber || null,
        expiryDate: rest.expiryDate ? new Date(rest.expiryDate) : null,
        storageConditions: rest.storageConditions || null,
        hazardClass: rest.hazardClass || null,
        storageUnit: rest.storageUnit,
        stockQuantity: stockInStorageUnit,
        minStockLevel: rest.minStockLevel || 0,
        ratePerUnit: ratePerUnit,
        sellerId: session.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Product',
        entityId: product.id,
        productId: product.id,
        newValue: serializeForJSON(product),
      },
    });

    return NextResponse.json(serializeForJSON(product), { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
