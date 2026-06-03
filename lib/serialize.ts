/**
 * Serialization helpers for Prisma data types that cannot be directly JSON-serialized.
 *
 * - BigInt (paise amounts) → number
 * - Prisma Decimal → string (preserves full precision)
 * - Date → ISO string
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

/**
 * Recursively serialize an object/array for JSON responses.
 * Converts BigInt → number, Decimal → string, Date → ISO string.
 */
export function serializeForJSON<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'bigint') {
    return Number(data) as unknown as T;
  }

  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Prisma Decimal objects have a toFixed / toString method
  if (typeof data === 'object' && 'toFixed' in (data as AnyObject) && 'd' in (data as AnyObject)) {
    return (data as AnyObject).toString() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeForJSON(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const serialized: AnyObject = {};
    for (const [key, value] of Object.entries(data as AnyObject)) {
      serialized[key] = serializeForJSON(value);
    }
    return serialized as T;
  }

  return data;
}

/**
 * Convert paise (stored as BigInt) to formatted INR string.
 * Example: 150050n → "₹1,500.50"
 */
export function formatINR(paise: bigint | number | null | undefined): string {
  if (paise === null || paise === undefined) return '₹0.00';
  const num = typeof paise === 'bigint' ? Number(paise) : paise;
  const rupees = num / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Convert a paise value to rupees number (for calculations / display).
 */
export function paiseToRupees(paise: bigint | number): number {
  const num = typeof paise === 'bigint' ? Number(paise) : paise;
  return num / 100;
}

/**
 * Convert rupees to paise for storage.
 */
export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

/**
 * Format a storage quantity into a human-readable string with appropriate unit.
 * Automatically picks the best display unit.
 */
export function formatQuantity(
  storageQuantity: number | string,
  storageUnit: 'mg' | 'ul' | 'unit'
): string {
  const qty = typeof storageQuantity === 'string' ? parseFloat(storageQuantity) : storageQuantity;

  if (storageUnit === 'mg') {
    if (qty >= 1_000_000) return `${(qty / 1_000_000).toFixed(2)} kg`;
    if (qty >= 1_000) return `${(qty / 1_000).toFixed(2)} g`;
    return `${qty.toFixed(3)} mg`;
  }

  if (storageUnit === 'ul') {
    if (qty >= 1_000_000) return `${(qty / 1_000_000).toFixed(2)} L`;
    if (qty >= 1_000) return `${(qty / 1_000).toFixed(2)} mL`;
    return `${qty.toFixed(2)} µL`;
  }

  return `${qty} units`;
}
