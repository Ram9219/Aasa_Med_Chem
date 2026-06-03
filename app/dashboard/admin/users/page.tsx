'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/ui/table';
import Badge, { getStatusBadgeVariant } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  companyName: string | null;
  role: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { products: number; quotationRequests: number; orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => addToast('error', 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const toggleActive = async (userId: string, isActive: boolean) => {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive }),
      });
      addToast('success', `User ${isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch {
      addToast('error', 'Failed to update user');
    }
  };

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'companyName', header: 'Company', render: (u: UserRow) => u.companyName || '—' },
    {
      key: 'role',
      header: 'Role',
      render: (u: UserRow) => (
        <Badge variant={getStatusBadgeVariant(u.role)} dot>{u.role}</Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (u: UserRow) => (
        <Badge variant={u.isActive ? 'approved' : 'rejected'} dot>
          {u.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u: UserRow) => (
        <button
          onClick={() => toggleActive(u.id, !u.isActive)}
          className={`text-xs font-medium px-3 py-1 rounded-md transition-colors cursor-pointer ${
            u.isActive
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-emerald-400 hover:bg-emerald-500/10'
          }`}
        >
          {u.isActive ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="animate-slideUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage buyers and sellers</p>
      </div>
      {loading ? <TableSkeleton rows={5} cols={6} /> : <DataTable columns={columns} data={users} emptyMessage="No users found" />}
    </div>
  );
}
