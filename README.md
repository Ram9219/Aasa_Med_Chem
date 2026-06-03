# AasaMedChem — B2B Chemical & Pharmaceutical Procurement Platform

AasaMedChem is a production-ready, pharma-grade B2B procurement platform designed for managing chemical inventory, RFQ (Request for Quotation) workflows, and order conversion with high precision.

## 🚀 Key Features

### 1. High-Precision Inventory & Units
* **Pharma-Grade Unit Conversion**: Supports multi-unit queries (e.g. buyer requests in kilograms or liters; inventory is managed internally in milligrams or microliters to ensure absolute precision and prevent floating-point errors).
* **Live Unit Converter & Price Estimator**: Real-time conversion and cost calculation on product pages.
* **Auto-Conversion to Base Storage Unit**: Translates commercial display units (`kg`, `g`, `L`, `mL`) to base database storage units (`mg`, `ul`) on order/quote submission.

### 2. Role-Based Access Control & Dashboards
* **Admin Dashboard**: Comprehensive platform health statistics, user activate/deactivate controls, global products/quotations/orders monitor, and detailed system-wide audit logs.
* **Seller Dashboard**: Complete product inventory management, incoming quotation/price negotiation handler, and status-progression order fulfillment system.
* **Buyer Dashboard**: Detailed chemical/pharma catalog browsing, multi-item quotation request builder, quotation-to-order converter, and order tracking.

### 3. Secure B2B Quotation Workflow
* **RFQ Builder**: Support for multi-item RFQs with custom specifications.
* **Price Negotiation**: Sellers can accept and reply with custom unit prices.
* **Order Conversion**: Buyers can accept quotes and instantly convert them to formal orders, which automatically reserves stock in inventory.

### 4. Enterprise Audit Trail
* **Action Logs**: Comprehensive, immutable logs recording actions (`CREATE`, `UPDATE`, `DELETE`, `CONVERT_TO_ORDER`), target entities, timestamp, user, and previous vs. new values for total transparency.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16.2.7 (App Router with async params, custom proxy routing)
* **Database**: PostgreSQL (Prisma v7 ORM)
* **Styling**: Tailwind CSS v4 (Custom dark pharmaceutical theme)
* **Auth**: NextAuth.js v5 (Beta)
* **Math Library**: `decimal.js` (Fixed-point high-precision arithmetic)

---

## 💻 Local Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5402/aasamedchem?schema=public"
NEXTAUTH_SECRET="a-very-secure-random-secret-key-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Prisma Migrations
Apply database migrations to set up schema structure:
```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database
Seed the database with default accounts, chemical products, and initial audit logs:
```bash
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@aasamedchem.com` | `admin123` |
| **Seller** | `seller@aasamedchem.com` | `seller123` |
| **Buyer** | `buyer@aasamedchem.com` | `buyer123` |

---

## 📐 Architecture Details

### Base Unit Configuration
* All mass/weight values are stored internally in **milligrams (mg)**.
* All volume values are stored internally in **microliters (µL)**.
* Discrete items are stored in **units**.
* All prices are stored in **paise (INR)** as `BigInt` to prevent rounding errors.

### Next.js 16 Route Protection
Instead of traditional `middleware.ts`, route validation is performed by the Next.js 16 **`proxy.ts`** runtime, enforcing secure routing rules on `/dashboard/*` sub-routes based on the JWT token session data.
# Aasa_Med_Chem
# Aasa_Med_Chem
