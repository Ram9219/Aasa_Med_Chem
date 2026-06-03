'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/loading';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditRow = Record<string, any>;

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit').then((r) => r.json()).then(setLogs).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (l: AuditRow) => new Date(l.createdAt).toLocaleString('en-IN'),
    },
    { key: 'user', header: 'User', render: (l: AuditRow) => l.user?.fullName || '—' },
    {
      key: 'role',
      header: 'Role',
      render: (l: AuditRow) => (
        <Badge variant={getStatusBadgeVariant(l.user?.role || 'info')} dot>{l.user?.role}</Badge>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (l: AuditRow) => (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">{l.action}</span>
      ),
    },
    { key: 'entity', header: 'Entity' },
    {
      key: 'changes',
      header: 'Details',
      render: (l: AuditRow) => {
        if (l.oldValue && l.newValue) {
          return <span className="text-xs text-slate-500">Modified</span>;
        }
        if (l.newValue) return <span className="text-xs text-emerald-400">Created</span>;
        if (l.oldValue) return <span className="text-xs text-red-400">Deleted</span>;
        return '—';
      },
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Complete activity trail for compliance</p>
      </div>
      {loading ? <TableSkeleton rows={8} cols={6} /> : <DataTable columns={columns} data={logs} emptyMessage="No audit logs yet" />}
    </div>
  );
}
