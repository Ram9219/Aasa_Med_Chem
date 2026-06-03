'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuotationRow = Record<string, any>;

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotations').then((r) => r.json()).then(setQuotations).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'quotationNumber', header: 'Quotation #' },
    { key: 'buyer', header: 'Buyer', render: (q: QuotationRow) => q.buyer?.companyName || q.buyer?.fullName || '—' },
    { key: 'seller', header: 'Seller', render: (q: QuotationRow) => q.seller?.companyName || '—' },
    { key: 'items', header: 'Items', render: (q: QuotationRow) => q.items?.length || 0 },
    { key: 'totalPaise', header: 'Total', render: (q: QuotationRow) => formatINR(q.totalPaise) },
    {
      key: 'status',
      header: 'Status',
      render: (q: QuotationRow) => (
        <Badge variant={getStatusBadgeVariant(q.status)} dot>{formatStatusLabel(q.status)}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (q: QuotationRow) => new Date(q.createdAt).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">All Quotations</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor quotation workflow across the platform</p>
      </div>
      {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={quotations} emptyMessage="No quotations yet" />}
    </div>
  );
}
