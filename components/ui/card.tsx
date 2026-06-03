import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-sm
        shadow-[0_12px_40px_rgba(0,0,0,0.18)]
        ${paddingSizes[padding]}
        ${hover ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:bg-white/7 hover:shadow-[0_18px_48px_rgba(0,0,0,0.24)]' : ''}
        ${glow ? 'animate-pulse-glow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'emerald' | 'cyan' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'emerald',
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={`
        rounded-2xl border ${colors.border} bg-white/5 backdrop-blur-sm
        p-5 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.16)]
        hover:-translate-y-0.5 hover:border-opacity-60 hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)]
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.bg} ${colors.text} p-2.5 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-100 tracking-tight">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
