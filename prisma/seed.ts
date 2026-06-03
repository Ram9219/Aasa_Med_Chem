import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role, StorageUnit } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'

// Prisma v7 ke liye - simple initialization
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  ),
})

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing data using raw SQL
    await prisma.$executeRaw`TRUNCATE TABLE "AuditLog" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "OrderItem" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "QuotationItem" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "QuotationRequest" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@aasamedchem.com',
        passwordHash: await bcrypt.hash('Admin@123', 12),
        role: Role.ADMIN,
        fullName: 'System Admin',
        companyName: 'AasaMedChem',
        phone: '+91-9876543210'
      }
    })
    console.log(`✅ Created Admin: ${admin.email}`)

    // Create Seller
    const seller = await prisma.user.create({
      data: {
        email: 'seller@chemco.com',
        passwordHash: await bcrypt.hash('Seller@123', 12),
        role: Role.SELLER,
        fullName: 'Rajesh Kumar',
        companyName: 'ChemCo Industries',
        phone: '+91-9876543211'
      }
    })
    console.log(`✅ Created Seller: ${seller.email}`)

    // Create Buyer
    const buyer = await prisma.user.create({
      data: {
        email: 'buyer@pharma.com',
        passwordHash: await bcrypt.hash('Buyer@123', 12),
        role: Role.BUYER,
        fullName: 'Priya Sharma',
        companyName: 'PharmaCorp Ltd',
        phone: '+91-9876543212'
      }
    })
    console.log(`✅ Created Buyer: ${buyer.email}`)

    // Create Products
    const product1 = await prisma.product.create({
      data: {
        name: 'Acetone HPLC Grade',
        casNumber: '67-64-1',
        sku: 'CHEM-ACET-001',
        category: 'Solvents',
        description: 'High-performance liquid chromatography grade acetone',
        chemicalName: 'Propan-2-one',
        molecularFormula: 'C3H6O',
        molecularWeight: 58.08,
        purity: 99.95,
        grade: 'HPLC Grade',
        manufacturer: 'Merck',
        batchNumber: 'AC-2026-001',
        storageConditions: 'Store in cool, dry place',
        hazardClass: 'Flammable',
        storageUnit: StorageUnit.mg,
        stockQuantity: 500000000,
        ratePerUnit: 0.00015,
        sellerId: seller.id
      }
    })
    console.log(`✅ Created Product: ${product1.name}`)

    const product2 = await prisma.product.create({
      data: {
        name: 'Paracetamol USP',
        casNumber: '103-90-2',
        sku: 'CHEM-PARA-001',
        category: 'API',
        description: 'Paracetamol USP grade for pharmaceutical formulations',
        chemicalName: 'N-(4-hydroxyphenyl)acetamide',
        molecularFormula: 'C8H9NO2',
        molecularWeight: 151.16,
        purity: 99.5,
        grade: 'USP Grade',
        manufacturer: 'Sri Krishna Pharmaceuticals',
        batchNumber: 'PC-2026-045',
        expiryDate: new Date('2028-12-31'),
        storageConditions: 'Store at room temperature (15-30°C)',
        storageUnit: StorageUnit.mg,
        stockQuantity: 250000000,
        ratePerUnit: 0.00008,
        sellerId: seller.id
      }
    })
    console.log(`✅ Created Product: ${product2.name}`)

    const product3 = await prisma.product.create({
      data: {
        name: 'Ethanol 96%',
        casNumber: '64-17-5',
        sku: 'CHEM-ETH-001',
        category: 'Solvents',
        description: 'Ethanol 96% for laboratory and pharmaceutical use',
        chemicalName: 'Ethyl alcohol',
        molecularFormula: 'C2H5OH',
        molecularWeight: 46.07,
        purity: 96.0,
        grade: 'Pharma Grade',
        manufacturer: 'India Glycols',
        batchNumber: 'ET-2026-012',
        storageConditions: 'Store in tightly sealed container',
        hazardClass: 'Flammable',
        storageUnit: StorageUnit.ul,
        stockQuantity: 1000000000,
        ratePerUnit: 0.0000001,
        sellerId: seller.id
      }
    })
    console.log(`✅ Created Product: ${product3.name}`)

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Seeding completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔐 Test Credentials:')
    console.log(`   Admin:  admin@aasamedchem.com / Admin@123`)
    console.log(`   Seller: seller@chemco.com / Seller@123`)
    console.log(`   Buyer:  buyer@pharma.com / Buyer@123`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


