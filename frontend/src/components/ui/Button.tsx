'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20': variant === 'primary',
          'bg-bg-elevated hover:bg-border text-text-primary border border-border': variant === 'secondary',
          'hover:bg-bg-elevated text-text-secondary hover:text-text-primary': variant === 'ghost',
          'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20': variant === 'danger',
          'border border-accent text-accent hover:bg-accent/10': variant === 'outline',
        },
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}