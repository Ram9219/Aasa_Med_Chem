'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div
          className={`
            relative rounded-lg border
            bg-[var(--bg-input)] transition-all duration-200
            ${error
              ? 'border-red-500/60 focus-within:border-red-400'
              : 'border-[var(--border-default)] focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/20'
            }
          `}
        >
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full appearance-none bg-transparent px-3 py-2.5 text-sm text-slate-100
              outline-none cursor-pointer pr-10
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-[var(--bg-card)] text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[var(--bg-card)] text-slate-200"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
