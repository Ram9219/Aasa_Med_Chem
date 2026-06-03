'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { formatINR } from '@/lib/serialize';
import Decimal from 'decimal.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = Record<string, any>;

interface QuoteItem {
  productId: string;
  product: Product;
  quantity: string;
  unit: string;
  estimatedPaise: number;
}

function NewQuotationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts);
  }, []);

  // Pre-add product from URL param
  useEffect(() => {
    const pid = searchParams.get('productId');
    if (pid && products.length > 0 && items.length === 0) {
      const p = products.find((pr) => pr.id === pid);
      if (p) addItem(p);
    }
  }, [products, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDisplayUnits = (storageUnit: string) => {
    if (storageUnit === 'mg') return [{ value: 'mg', label: 'mg' }, { value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }];
    if (storageUnit === 'ul') return [{ value: 'ul', label: 'µL' }, { value: 'mL', label: 'mL' }, { value: 'L', label: 'L' }];
    return [{ value: 'unit', label: 'unit' }];
  };

  const calculateEstimate = (product: Product, quantity: string, unit: string): number => {
    try {
      const qty = new Decimal(quantity || '0');
      if (qty.lte(0)) return 0;
      const factors: Record<string, number> = { mg: 1, g: 1000, kg: 1000000, ul: 1, mL: 1000, L: 1000000, unit: 1 };
      const storageQty = qty.times(factors[unit] || 1);
      return Number(storageQty.times(new Decimal(product.ratePerUnit)).toDecimalPlaces(0));
    } catch { return 0; }
  };

  const addItem = (product: Product) => {
    if (items.some((i) => i.productId === product.id)) {
      addToast('info', 'Product already added');
      return;
    }
    const defaultUnit = product.storageUnit === 'mg' ? 'kg' : product.storageUnit === 'ul' ? 'L' : 'unit';
    setItems([...items, {
      productId: product.id,
      product,
      quantity: '1',
      unit: defaultUnit,
      estimatedPaise: calculateEstimate(product, '1', defaultUnit),
    }]);
  };

  const updateItem = (index: number, field: 'quantity' | 'unit', value: string) => {
    setItems((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      const updated = { ...item, [field]: value };
      updated.estimatedPaise = calculateEstimate(item.product, updated.quantity, updated.unit);
      return updated;
    }));
  };

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const totalEstimate = items.reduce((sum, i) => sum + i.estimatedPaise, 0);

  const handleSubmit = async () => {
    if (items.length === 0) { addToast('error', 'Add at least one item'); return; }
    setLoading(true);

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: parseFloat(i.quantity), unit: i.unit })),
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast('success', 'Quotation submitted successfully!');
      router.push('/dashboard/buyer/quotations');
    } catch {
      addToast('error', 'Failed to submit quotation');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.casNumber && p.casNumber.includes(searchTerm))
  );

  return (
    <div className="animate-slideUp max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">New Quotation Request</h1>
        <p className="text-sm text-slate-500 mt-1">Add chemicals and submit for seller pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Add Product */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Add Products</h3>
            <Input placeholder="Search chemicals..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-3" />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredProducts.slice(0, 10).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addItem(p)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-left text-sm transition-colors cursor-pointer"
                >
                  <div>
                    <span className="text-slate-200">{p.name}</span>
                    {p.casNumber && <span className="text-slate-500 ml-2 text-xs">CAS: {p.casNumber}</span>}
                  </div>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              ))}
            </div>
          </Card>

          {/* Items */}
          {items.map((item, index) => (
            <Card key={item.productId} className="border-emerald-500/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.product.name}</h4>
                  <p className="text-xs text-slate-500">{item.product.casNumber || item.product.sku}</p>
                </div>
                <button onClick={() => removeItem(index)} className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1"><Input label="Quantity" type="number" step="0.001" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} min="0" /></div>
                <div className="w-24"><Select label="Unit" options={getDisplayUnits(item.product.storageUnit)} value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} /></div>
                <div className="text-right pb-2"><p className="text-xs text-slate-500">Est. Price</p><p className="text-sm font-semibold text-emerald-400">{formatINR(item.estimatedPaise)}</p></div>
              </div>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">Search and add chemicals above to build your quotation</div>
          )}

          <Card>
            <Input label="Notes for Seller (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements, delivery timeline, etc." />
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-6 border-emerald-500/20">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-slate-400">Items</span><span className="text-slate-200">{items.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-slate-200">{formatINR(totalEstimate)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">GST (18%)</span><span className="text-slate-200">{formatINR(Math.round(totalEstimate * 0.18))}</span></div>
              <hr className="border-[var(--border-default)]" />
              <div className="flex justify-between font-bold"><span className="text-slate-300">Estimated Total</span><span className="text-emerald-400 text-lg">{formatINR(Math.round(totalEstimate * 1.18))}</span></div>
            </div>
            <p className="text-[10px] text-slate-600 mb-4">Final pricing will be confirmed by the seller</p>
            <Button className="w-full" size="lg" onClick={handleSubmit} loading={loading} disabled={items.length === 0}>
              Submit Quotation
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewQuotationPage() {
  return (
    <Suspense fallback={<div className="text-slate-500 p-8">Loading...</div>}>
      <NewQuotationForm />
    </Suspense>
  );
}
