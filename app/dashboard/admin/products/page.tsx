'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/loading';
import { formatQuantity } from '@/lib/serialize';
import Input from '@/components/ui/input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductRow = Record<string, any>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = search ? `/api/products?search=${encodeURIComponent(search)}` : '/api/products';
    setLoading(true);
    fetch(url).then((r) => r.json()).then(setProducts).finally(() => setLoading(false));
  }, [search]);

  const columns = [
    { key: 'name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    { key: 'casNumber', header: 'CAS #', render: (p: ProductRow) => p.casNumber || '—' },
    {
      key: 'stockQuantity',
      header: 'Stock',
      render: (p: ProductRow) => formatQuantity(p.stockQuantity, p.storageUnit),
    },
    { key: 'purity', header: 'Purity', render: (p: ProductRow) => p.purity ? `${p.purity}%` : '—' },
    { key: 'seller', header: 'Seller', render: (p: ProductRow) => p.seller?.companyName || '—' },
    {
      key: 'isActive',
      header: 'Status',
      render: (p: ProductRow) => (
        <Badge variant={p.isActive ? 'approved' : 'rejected'} dot>
          {p.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">All Products</h1>
          <p className="text-sm text-slate-500 mt-1">View products across all sellers</p>
        </div>
      </div>
      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
        />
      </div>
      {loading ? <TableSkeleton rows={5} cols={8} /> : <DataTable columns={columns} data={products} emptyMessage="No products found" />}
    </div>
  );
}
