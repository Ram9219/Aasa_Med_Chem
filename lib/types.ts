import { type DefaultSession } from 'next-auth';

/**
 * Extend NextAuth types to include role, companyName, and user ID.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      companyName: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    companyName: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    companyName: string | null;
  }
}

// ─── API Request / Response Types ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// Product types for API
export interface CreateProductPayload {
  name: string;
  casNumber?: string;
  sku: string;
  category: string;
  description?: string;
  chemicalName?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  purity?: number;
  grade?: string;
  manufacturer?: string;
  batchNumber?: string;
  expiryDate?: string;
  storageConditions?: string;
  hazardClass?: string;
  storageUnit: 'mg' | 'ul' | 'unit';
  stockQuantity: number;
  minStockLevel?: number;
  ratePerUnit: number; // In rupees — converted to paise on server
  currency?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  isActive?: boolean;
}

// Quotation types
export interface QuotationItemPayload {
  productId: string;
  quantity: number;
  unit: 'mg' | 'g' | 'kg' | 'ul' | 'mL' | 'L' | 'unit';
}

export interface CreateQuotationPayload {
  items: QuotationItemPayload[];
  notes?: string;
}

export interface UpdateQuotationPayload {
  status?: string;
  adminNotes?: string;
  sellerPricing?: {
    itemId: string;
    unitPricePaise: number;
  }[];
}

// Order types
export interface UpdateOrderPayload {
  status?: string;
  paymentStatus?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalUsers?: number;
  totalProducts?: number;
  totalBuyers?: number;
  totalSellers?: number;
  pendingQuotations: number;
  activeOrders: number;
  revenue?: number;
  lowStockProducts?: number;
  myProducts?: number;
  totalSpend?: number;
}
