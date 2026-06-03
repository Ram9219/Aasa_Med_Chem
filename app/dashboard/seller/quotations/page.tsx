'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';
import { useToast } from '@/components/ui/toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuotationRow = Record<string, any>;

export default function SellerQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = () => {
    setLoading(true);
    fetch('/api/quotations').then((r) => r.json()).then(setQuotations).finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const handleQuote = async (id: string) => {
    try {
      await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SELLER_QUOTED' }),
      });
      addToast('success', 'Quotation accepted and sent to buyer');
      fetchData();
    } catch {
      addToast('error', 'Failed to update quotation');
    }
  };

  const columns = [
    { key: 'quotationNumber', header: 'Quotation #' },
    { key: 'buyer', header: 'Buyer', render: (q: QuotationRow) => q.buyer?.companyName || q.buyer?.fullName || '—' },
    { key: 'items', header: 'Items', render: (q: QuotationRow) => q.items?.length || 0 },
    { key: 'totalPaise', header: 'Total', render: (q: QuotationRow) => formatINR(q.totalPaise) },
    {
      key: 'status',
      header: 'Status',
      render: (q: QuotationRow) => (
        <Badge variant={getStatusBadgeVariant(q.status)} dot>{formatStatusLabel(q.status)}</Badge>
      ),
    },
    { key: 'createdAt', header: 'Date', render: (q: QuotationRow) => new Date(q.createdAt).toLocaleDateString('en-IN') },
    {
      key: 'actions',
      header: 'Actions',
      render: (q: QuotationRow) =>
        q.status === 'SUBMITTED' ? (
          <Button size="sm" onClick={() => handleQuote(q.id)}>Accept & Quote</Button>
        ) : null,
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Quotation Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Incoming requests from buyers</p>
      </div>
      {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={quotations} emptyMessage="No quotation requests" />}
    </div>
  );
}
