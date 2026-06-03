'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefix, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <div
          className={`
            flex items-center gap-2 rounded-xl border px-3.5
            bg-white/5 backdrop-blur-sm transition-all duration-200
            ${error
              ? 'border-red-500/50 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-500/20'
              : 'border-white/10 focus-within:border-emerald-400/60 focus-within:ring-1 focus-within:ring-emerald-400/20'
            }
          `}
        >
          {prefix && (
            <span className="text-slate-500 text-sm flex-shrink-0">{prefix}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-transparent py-2.75 text-sm text-slate-100
              placeholder:text-slate-500 outline-none
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="text-slate-500 text-sm flex-shrink-0">{suffix}</span>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
