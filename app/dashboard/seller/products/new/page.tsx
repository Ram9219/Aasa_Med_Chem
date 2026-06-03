'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

const CATEGORIES = [
  { value: 'Solvents', label: 'Solvents' },
  { value: 'API', label: 'Active Pharmaceutical Ingredients' },
  { value: 'Excipients', label: 'Excipients' },
  { value: 'Reagents', label: 'Reagents' },
  { value: 'Lab Supplies', label: 'Lab Supplies' },
];

const STORAGE_UNITS = [
  { value: 'mg', label: 'mg (Weight — stored in milligrams)' },
  { value: 'ul', label: 'µL (Volume — stored in microliters)' },
  { value: 'unit', label: 'Unit (Count)' },
];

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', sku: '', category: '', casNumber: '', chemicalName: '',
    molecularFormula: '', molecularWeight: '', purity: '', grade: '',
    manufacturer: '', batchNumber: '', expiryDate: '', storageConditions: '',
    hazardClass: '', description: '', storageUnit: 'mg',
    stockQuantity: '', stockDisplayUnit: 'kg',
    rateInRupees: '', rateDisplayUnit: 'kg',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const weightUnits = [{ value: 'mg', label: 'mg' }, { value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }];
  const volumeUnits = [{ value: 'ul', label: 'µL' }, { value: 'mL', label: 'mL' }, { value: 'L', label: 'L' }];
  const unitUnits = [{ value: 'unit', label: 'unit' }];

  const displayUnits = form.storageUnit === 'mg' ? weightUnits : form.storageUnit === 'ul' ? volumeUnits : unitUnits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          category: form.category,
          casNumber: form.casNumber || undefined,
          chemicalName: form.chemicalName || undefined,
          molecularFormula: form.molecularFormula || undefined,
          molecularWeight: form.molecularWeight ? parseFloat(form.molecularWeight) : undefined,
          purity: form.purity ? parseFloat(form.purity) : undefined,
          grade: form.grade || undefined,
          manufacturer: form.manufacturer || undefined,
          batchNumber: form.batchNumber || undefined,
          expiryDate: form.expiryDate || undefined,
          storageConditions: form.storageConditions || undefined,
          hazardClass: form.hazardClass || undefined,
          description: form.description || undefined,
          storageUnit: form.storageUnit,
          stockQuantity: parseFloat(form.stockQuantity),
          stockDisplayUnit: form.stockDisplayUnit,
          rateInRupees: parseFloat(form.rateInRupees),
          rateDisplayUnit: form.rateDisplayUnit,
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      addToast('success', 'Product created successfully!');
      router.push('/dashboard/seller/products');
    } catch {
      addToast('error', 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slideUp max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Add New Product</h1>
        <p className="text-sm text-slate-500 mt-1">Enter chemical specifications with precision</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name *" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="e.g., Acetone HPLC Grade" />
            <Input label="SKU *" value={form.sku} onChange={(e) => update('sku', e.target.value)} required placeholder="e.g., CHEM-ACET-001" />
            <Select label="Category *" options={CATEGORIES} value={form.category} onChange={(e) => update('category', e.target.value)} required placeholder="Select category" />
            <Input label="Description" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief description" />
          </div>
        </Card>

        {/* Chemical Metadata */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Chemical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="CAS Number" value={form.casNumber} onChange={(e) => update('casNumber', e.target.value)} placeholder="e.g., 67-64-1" />
            <Input label="Chemical Name" value={form.chemicalName} onChange={(e) => update('chemicalName', e.target.value)} placeholder="e.g., Propan-2-one" />
            <Input label="Molecular Formula" value={form.molecularFormula} onChange={(e) => update('molecularFormula', e.target.value)} placeholder="e.g., C3H6O" />
            <Input label="Molecular Weight" type="number" step="0.0001" value={form.molecularWeight} onChange={(e) => update('molecularWeight', e.target.value)} placeholder="e.g., 58.08" />
            <Input label="Purity (%)" type="number" step="0.01" value={form.purity} onChange={(e) => update('purity', e.target.value)} placeholder="e.g., 99.95" />
            <Input label="Grade" value={form.grade} onChange={(e) => update('grade', e.target.value)} placeholder="e.g., HPLC Grade" />
            <Input label="Manufacturer" value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} placeholder="e.g., Merck" />
            <Input label="Batch Number" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} placeholder="e.g., AC-2026-001" />
            <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
          </div>
        </Card>

        {/* Safety */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Storage & Safety</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Storage Conditions" value={form.storageConditions} onChange={(e) => update('storageConditions', e.target.value)} placeholder="e.g., Store in cool, dry place" />
            <Input label="Hazard Class" value={form.hazardClass} onChange={(e) => update('hazardClass', e.target.value)} placeholder="e.g., Flammable" />
          </div>
        </Card>

        {/* Stock & Pricing */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Stock & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Base Storage Unit *" options={STORAGE_UNITS} value={form.storageUnit} onChange={(e) => { update('storageUnit', e.target.value); update('stockDisplayUnit', e.target.value === 'mg' ? 'kg' : e.target.value === 'ul' ? 'L' : 'unit'); update('rateDisplayUnit', e.target.value === 'mg' ? 'kg' : e.target.value === 'ul' ? 'L' : 'unit'); }} />

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input label="Stock Quantity *" type="number" step="0.001" value={form.stockQuantity} onChange={(e) => update('stockQuantity', e.target.value)} required placeholder="e.g., 500" />
              </div>
              <div className="w-24">
                <Select options={displayUnits} value={form.stockDisplayUnit} onChange={(e) => update('stockDisplayUnit', e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input label="Rate (₹) *" type="number" step="0.01" value={form.rateInRupees} onChange={(e) => update('rateInRupees', e.target.value)} required placeholder="e.g., 1500" prefix="₹" />
              </div>
              <div className="w-24">
                <Select options={displayUnits} value={form.rateDisplayUnit} onChange={(e) => update('rateDisplayUnit', e.target.value)} />
              </div>
            </div>
          </div>

          {form.rateInRupees && form.stockQuantity && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-400">
                💡 Rate: ₹{form.rateInRupees} per {form.rateDisplayUnit} · Stock: {form.stockQuantity} {form.stockDisplayUnit}
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Product</Button>
        </div>
      </form>
    </div>
  );
}
