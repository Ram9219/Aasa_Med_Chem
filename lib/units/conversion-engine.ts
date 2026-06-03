// IMPORTANT: Install decimal.js first
// npm install decimal.js
// npm install -D @types/decimal.js

import Decimal from 'decimal.js';
import { StorageUnit, DisplayUnit } from '@prisma/client';

Decimal.config({ 
  precision: 30,
  rounding: Decimal.ROUND_HALF_UP 
});

// ALL WEIGHTS -> MILLIGRAMS (mg)
// ALL VOLUMES -> MICROLITERS (ul)
export const TO_STORAGE: Record<string, Record<string, { to: string; factor: string }>> = {
  weight: {
    mg: { to: 'mg', factor: '1' },
    g:  { to: 'mg', factor: '1000' },
    kg: { to: 'mg', factor: '1000000' }
  },
  volume: {
    ul: { to: 'ul', factor: '1' },
    mL: { to: 'ul', factor: '1000' },
    L:  { to: 'ul', factor: '1000000' }
  },
  count: {
    unit: { to: 'unit', factor: '1' }
  }
};

export const FROM_STORAGE: Record<string, Record<string, string>> = {
  mg: {
    mg: '1',
    g:  '0.001',
    kg: '0.000001'
  },
  ul: {
    ul: '1',
    mL: '0.001',
    L:  '0.000001'
  },
  unit: {
    unit: '1'
  }
};

export function getUnitCategory(unit: string): 'weight' | 'volume' | 'count' {
  if (['mg', 'g', 'kg'].includes(unit)) return 'weight';
  if (['ul', 'mL', 'L'].includes(unit)) return 'volume';
  return 'count';
}

export function convertToStorage(
  quantity: number | string | Decimal,
  fromUnit: DisplayUnit,
  productStorageUnit: StorageUnit
): Decimal {
  const q = new Decimal(quantity.toString());
  const category = getUnitCategory(fromUnit);
  const storageCategory = getUnitCategory(productStorageUnit);
  
  if (category !== storageCategory) {
    throw new Error(`Cannot convert ${fromUnit} (${category}) to ${productStorageUnit} (${storageCategory})`);
  }
  
  const conversion = TO_STORAGE[category]?.[fromUnit];
  if (!conversion) {
    throw new Error(`Unknown conversion from ${fromUnit}`);
  }
  
  return q.times(conversion.factor);
}

export function convertFromStorage(
  quantity: number | string | Decimal,
  fromUnit: StorageUnit,
  toUnit: DisplayUnit
): Decimal {
  const q = new Decimal(quantity.toString());
  const factor = FROM_STORAGE[fromUnit]?.[toUnit];
  
  if (!factor) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`);
  }
  
  return q.times(factor);
}

// Minimum quantities for pharmaceutical precision
export const MINIMUM_QUANTITIES: Record<string, number> = {
  mg: 0.001,
  g: 0.000001,
  kg: 0.000000001,
  ul: 0.01,
  mL: 0.00001,
  L: 0.00000001,
  unit: 1
};

export function validateQuantity(quantity: number, unit: string): boolean {
  return quantity >= (MINIMUM_QUANTITIES[unit] || 0.001);
}

// Price helpers
export function paiseToRupees(paise: bigint | number): string {
  const num = typeof paise === 'bigint' ? Number(paise) : paise;
  return (num / 100).toFixed(2);
}

export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

export function calculatePrice(
  quantity: number | string | Decimal,
  ratePerStorageUnit: number | string | Decimal,
  displayUnit: DisplayUnit,
  storageUnit: StorageUnit
): {
  storageQuantity: Decimal;
  totalPaise: bigint;
  unitPricePaise: bigint;
} {
  const q = new Decimal(quantity.toString());
  const rate = new Decimal(ratePerStorageUnit.toString());
  
  // Convert to storage unit first
  const storageQty = convertToStorage(q, displayUnit, storageUnit);
  
  // Calculate total in paise (rate is per storage unit in paise)
  const totalDecimal = storageQty.times(rate);
  const totalPaiseNum = totalDecimal.toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  
  // Unit price in paise for the display unit
  const unitPriceDecimal = totalDecimal.dividedBy(q).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
  
  return {
    storageQuantity: storageQty,
    totalPaise: BigInt(totalPaiseNum.toString()),
    unitPricePaise: BigInt(unitPriceDecimal.toString())
  };
}

// Check stock availability
export function checkStock(
  requestedQuantity: Decimal,
  currentStock: Decimal
): boolean {
  return requestedQuantity.lte(currentStock);
}