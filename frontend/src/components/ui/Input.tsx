'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200',
          error ? 'border-red-500/50' : 'border-border hover:border-border-subtle',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;