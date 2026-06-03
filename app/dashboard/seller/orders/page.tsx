'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import Select from '@/components/ui/select';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';
import { useToast } from '@/components/ui/toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderRow = Record<string, any>;

const STATUS_OPTIONS = [
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'DISPATCHED', label: 'Dispatched' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = () => {
    setLoading(true);
    fetch('/api/orders').then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      addToast('success', `Order status updated to ${status}`);
      fetchData();
    } catch (err) {
      addToast('error', `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const columns = [
    { key: 'orderNumber', header: 'Order #' },
    { key: 'buyer', header: 'Buyer', render: (o: OrderRow) => o.buyer?.companyName || '—' },
    { key: 'items', header: 'Items', render: (o: OrderRow) => o.items?.length || 0 },
    { key: 'totalPaise', header: 'Total', render: (o: OrderRow) => formatINR(o.totalPaise) },
    {
      key: 'status', header: 'Status',
      render: (o: OrderRow) => <Badge variant={getStatusBadgeVariant(o.status)} dot>{formatStatusLabel(o.status)}</Badge>,
    },
    {
      key: 'paymentStatus', header: 'Payment',
      render: (o: OrderRow) => <Badge variant={getStatusBadgeVariant(o.paymentStatus)} dot>{formatStatusLabel(o.paymentStatus)}</Badge>,
    },
    {
      key: 'actions', header: 'Update',
      render: (o: OrderRow) =>
        o.status !== 'DELIVERED' && o.status !== 'CANCELLED' ? (
          <Select
            options={STATUS_OPTIONS.filter((s) => {
              const flow = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
              return flow.indexOf(s.value) > flow.indexOf(o.status);
            })}
            placeholder="Update..."
            onChange={(e) => updateStatus(o.id, e.target.value)}
          />
        ) : null,
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Fulfill and track orders</p>
      </div>
      {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={orders} emptyMessage="No orders yet" />}
    </div>
  );
}
