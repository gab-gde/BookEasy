'use client';
import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; isLoading?: boolean; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => (
  <button ref={ref} className={cn('btn', `btn-${variant}`, `btn-${size}`, className)} disabled={disabled || isLoading} {...props}>
    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
));
Button.displayName = 'Button';

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helperText?: string; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, helperText, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={cn('input', error && 'border-red-500 focus:ring-red-500', className)} {...props} />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    {helperText && !error && <p className="mt-1 text-sm text-slate-500">{helperText}</p>}
  </div>
));
Input.displayName = 'Input';

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[]; }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, options, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <select ref={ref} className={cn('input pr-10 appearance-none bg-no-repeat bg-right', className)} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }} {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
));
Select.displayName = 'Select';

// Badge
export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string }) {
  const variants = { default: 'bg-slate-100 text-slate-700', success: 'bg-emerald-100 text-emerald-800', warning: 'bg-amber-100 text-amber-800', danger: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800' };
  return <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', variants[variant], className)}>{children}</span>;
}

// Modal
export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto p-6">
        {title && <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

// EmptyState
export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-slate-400" /></div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}

// Skeleton
export function Skeleton({ className }: { className?: string }) { return <div className={cn('animate-pulse bg-slate-200 rounded', className)} />; }
export function SkeletonCard() { return <div className="card p-6"><Skeleton className="h-6 w-3/4 mb-4" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-1/2" /></div>; }
export function SkeletonTable({ rows = 5 }: { rows?: number }) { return <div className="space-y-3">{Array(rows).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>; }
