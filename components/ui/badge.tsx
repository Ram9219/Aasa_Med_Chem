import React from 'react';

type BadgeVariant =
  | 'pending' | 'approved' | 'rejected' | 'info'
  | 'processing' | 'draft' | 'delivered' | 'paid'
  | 'accepted' | 'submitted' | 'reviewed' | 'quoted'
  | 'cancelled' | 'admin' | 'seller' | 'buyer';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_MAP: Record<string, BadgeVariant> = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  SELLER_QUOTED: 'quoted',
  BUYER_ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'rejected',
  CONVERTED_TO_ORDER: 'approved',
  PENDING: 'pending',
  CONFIRMED: 'approved',
  PROCESSING: 'processing',
  DISPATCHED: 'processing',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  PAID: 'paid',
  PARTIAL: 'pending',
  REFUNDED: 'info',
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer',
};

export function getStatusBadgeVariant(status: string): BadgeVariant {
  return STATUS_MAP[status] || 'info';
}

export function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Badge({ 
  variant, 
  children, 
  dot = false, 
  className = '',
  size = 'md'
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`badge badge-${variant} inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses} ${className}`}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: 'currentColor',
            boxShadow: '0 0 6px currentColor',
          }}
        />
      )}
      {children}
    </span>
  );
}
