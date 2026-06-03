// 'use client';

// import { useEffect, useState } from 'react';
// import DataTable from '@/components/ui/table';
// import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
// import Button from '@/components/ui/button';
// import { TableSkeleton } from '@/components/ui/loading';
// import { formatINR } from '@/lib/serialize';
// import { useToast } from '@/components/ui/toast';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type OrderRow = Record<string, any>;

// export default function BuyerOrdersPage() {
//   const [orders, setOrders] = useState<OrderRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   const fetchData = () => {
//     setLoading(true);
//     fetch('/api/orders').then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
//   };

//   useEffect(fetchData, []);

//   const cancelOrder = async (id: string) => {
//     try {
//       const res = await fetch(`/api/orders/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'CANCELLED' }),
//       });
//       if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
//       addToast('success', 'Order cancelled');
//       fetchData();
//     } catch (err) {
//       addToast('error', `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     }
//   };

//   const columns = [
//     { key: 'orderNumber', header: 'Order #' },
//     { key: 'items', header: 'Items', render: (o: OrderRow) => o.items?.length || 0 },
//     { key: 'totalPaise', header: 'Total', render: (o: OrderRow) => formatINR(o.totalPaise) },
//     {
//       key: 'status', header: 'Status',
//       render: (o: OrderRow) => <Badge variant={getStatusBadgeVariant(o.status)} dot>{formatStatusLabel(o.status)}</Badge>,
//     },
//     {
//       key: 'paymentStatus', header: 'Payment',
//       render: (o: OrderRow) => <Badge variant={getStatusBadgeVariant(o.paymentStatus)} dot>{formatStatusLabel(o.paymentStatus)}</Badge>,
//     },
//     { key: 'createdAt', header: 'Date', render: (o: OrderRow) => new Date(o.createdAt).toLocaleDateString('en-IN') },
//     {
//       key: 'actions', header: 'Actions',
//       render: (o: OrderRow) =>
//         o.status === 'PENDING' ? (
//           <Button size="sm" variant="danger" onClick={() => cancelOrder(o.id)}>Cancel</Button>
//         ) : null,
//     },
//   ];

//   return (
//     <div className="animate-slideUp">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-100">My Orders</h1>
//         <p className="text-sm text-slate-500 mt-1">Track your order status and payments</p>
//       </div>
//       {loading ? <TableSkeleton rows={5} cols={7} /> : <DataTable columns={columns} data={orders} emptyMessage="No orders yet" />}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant, formatStatusLabel } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/loading';
import { formatINR } from '@/lib/serialize';
import { useToast } from '@/components/ui/toast';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderRow = Record<string, any>;

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchData = () => {
    setLoading(true);
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const cancelOrder = async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      addToast('success', 'Order cancelled');
      fetchData();
    } catch (err) {
      addToast('error', `Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3.5 h-3.5" />;
      case 'PROCESSING':
        return <Package className="w-3.5 h-3.5" />;
      case 'SHIPPED':
        return <Truck className="w-3.5 h-3.5" />;
      case 'DELIVERED':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'CANCELLED':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order Number',
      render: (o: OrderRow) => (
        <div className="flex flex-col">
          <span className="text-sm font-mono font-medium text-slate-800 dark:text-slate-100">
            {o.orderNumber}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date(o.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o: OrderRow) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {o.items?.length || 0} {o.items?.length === 1 ? 'item' : 'items'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {o.items?.map((i: any) => i.name).slice(0, 2).join(', ')}
            {o.items?.length > 2 && ` +${o.items.length - 2} more`}
          </span>
        </div>
      ),
    },
    {
      key: 'totalPaise',
      header: 'Total Amount',
      render: (o: OrderRow) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatINR(o.totalPaise)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Inclusive of tax
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (o: OrderRow) => (
        <div className="flex items-center gap-1.5">
          {getStatusIcon(o.status)}
          <Badge variant={getStatusBadgeVariant(o.status)} size="sm">
            {formatStatusLabel(o.status)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o: OrderRow) => (
        <Badge 
          variant={getStatusBadgeVariant(o.paymentStatus)} 
          size="sm"
          className="capitalize"
        >
          {formatStatusLabel(o.paymentStatus)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (o: OrderRow) =>
        o.status === 'PENDING' ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => cancelOrder(o.id)}
            loading={cancellingId === o.id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            Cancel order
          </Button>
        ) : o.status === 'DELIVERED' ? (
          <button className="text-xs text-slate-400 dark:text-slate-500 cursor-default">
            Completed
          </button>
        ) : (
          <button className="text-xs text-slate-400 dark:text-slate-500 cursor-default">
            {o.status === 'CANCELLED' ? 'Cancelled' : 'In progress'}
          </button>
        ),
    },
  ];

  // Stats cards
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track and manage all your purchases
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Package className="w-4 h-4" />
              <span>{stats.total} total orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Delivered</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {stats.delivered}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cancelled</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
                {stats.cancelled}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
              No orders yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Start shopping to see your orders here
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/marketplace'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                        {col.render ? col.render(order) : order[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}