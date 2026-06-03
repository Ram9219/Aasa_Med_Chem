'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderRow = Record<string, any>;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'orderNumber', header: 'Order #' },
    { key: 'buyer', header: 'Buyer', render: (o: OrderRow) => o.buyer?.companyName || o.buyer?.fullName || '—' },
    { key: 'items', header: 'Items', render: (o: OrderRow) => o.items?.length || 0 },
    { key: 'totalPaise', header: 'Total', render: (o: OrderRow) => formatINR(o.totalPaise) },
    {
      key: 'status',
      header: 'Status',
      render: (o: OrderRow) => (
        <Badge variant={getStatusBadgeVariant(o.status)} dot>{formatStatusLabel(o.status)}</Badge>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o: OrderRow) => (
        <Badge variant={getStatusBadgeVariant(o.paymentStatus)} dot>{formatStatusLabel(o.paymentStatus)}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (o: OrderRow) => new Date(o.createdAt).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">All Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Track orders and payments</p>
      </div>
      {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={orders} emptyMessage="No orders yet" />}
    </div>
  );
}
