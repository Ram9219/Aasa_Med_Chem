'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';
import { useToast } from '@/components/ui/toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuotationRow = Record<string, any>;

export default function BuyerQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = () => {
    setLoading(true);
    fetch('/api/quotations').then((r) => r.json()).then(setQuotations).finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      addToast('success', `Quotation ${status === 'BUYER_ACCEPTED' ? 'accepted' : 'rejected'}`);
      fetchData();
    } catch { addToast('error', 'Failed to update'); }
  };

  const convertToOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/quotations/${id}/convert`, { method: 'POST' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      addToast('success', 'Order created successfully!');
      fetchData();
    } catch (err) {
      addToast('error', `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const columns = [
    { key: 'quotationNumber', header: 'Quotation #' },
    { key: 'seller', header: 'Seller', render: (q: QuotationRow) => q.seller?.companyName || '—' },
    { key: 'items', header: 'Items', render: (q: QuotationRow) => q.items?.length || 0 },
    { key: 'totalPaise', header: 'Total', render: (q: QuotationRow) => formatINR(q.totalPaise) },
    {
      key: 'status', header: 'Status',
      render: (q: QuotationRow) => <Badge variant={getStatusBadgeVariant(q.status)} dot>{formatStatusLabel(q.status)}</Badge>,
    },
    { key: 'createdAt', header: 'Date', render: (q: QuotationRow) => new Date(q.createdAt).toLocaleDateString('en-IN') },
    {
      key: 'actions', header: 'Actions',
      render: (q: QuotationRow) => {
        if (q.status === 'SELLER_QUOTED') {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => updateStatus(q.id, 'BUYER_ACCEPTED')}>Accept</Button>
              <Button size="sm" variant="danger" onClick={() => updateStatus(q.id, 'REJECTED')}>Reject</Button>
            </div>
          );
        }
        if (q.status === 'BUYER_ACCEPTED') {
          return <Button size="sm" variant="outline" onClick={() => convertToOrder(q.id)}>Convert to Order</Button>;
        }
        return null;
      },
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">Track your quotation requests</p>
        </div>
        <Link href="/dashboard/buyer/quotations/new">
          <Button icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            New Quotation
          </Button>
        </Link>
      </div>
      {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={quotations} emptyMessage="No quotations yet. Browse chemicals to request one!" />}
    </div>
  );
}
