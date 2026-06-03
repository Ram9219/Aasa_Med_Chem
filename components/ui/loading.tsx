import React from 'react';

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <svg className={`animate-spin ${sizes[size]} text-emerald-400`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Skeleton({
  className = '',
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-shimmer h-4 rounded-md"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-default)]">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="animate-shimmer h-3 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 p-4 border-b border-[var(--border-default)] last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="animate-shimmer h-4 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="animate-shimmer w-10 h-10 rounded-lg" />
        <div className="animate-shimmer w-16 h-4 rounded" />
      </div>
      <div className="animate-shimmer w-24 h-7 rounded mb-2" />
      <div className="animate-shimmer w-32 h-4 rounded" />
    </div>
  );
}
