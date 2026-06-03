'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-950/20 hover:from-emerald-400 hover:to-cyan-400 active:from-emerald-600 active:to-cyan-600',
  secondary:
    'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/8 hover:border-white/15 active:bg-white/10',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-950/20 hover:from-red-400 hover:to-rose-400 active:from-red-600 active:to-rose-600',
  ghost:
    'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5',
  outline:
    'bg-transparent text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/10 hover:border-emerald-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-lg',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold tracking-tight
        transition-all duration-200 ease-out shadow-sm hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
    
  );
  
}

