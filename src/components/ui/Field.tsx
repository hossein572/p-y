import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FieldWrapProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * گره فرم را با aria-label (نمایان‌شده)، aria-invalid و aria-describedby
 * به برچسب و پیام خطا متصل می‌کند تا اسکرین‌ریدر خطا را با فیلد پیوند بزند.
 */
export function FieldWrap({ label, error, hint, children, className }: FieldWrapProps) {
  const idBase = React.useId();
  const errId = `${idBase}-err`;
  const hintId = `${idBase}-hint`;

  let control = children;
  if (React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    control = React.cloneElement(children as React.ReactElement, {
      'aria-label': childProps['aria-label'] ?? label,
      ...(error ? { 'aria-invalid': true, 'aria-describedby': errId } : hint ? { 'aria-describedby': hintId } : {}),
    });
  }

  return (
    <div className={className}>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      {control}
      {hint && !error && (
        <span id={hintId} className="mt-1.5 block text-xs text-ink-faint">
          {hint}
        </span>
      )}
      {error && (
        <span
          id={errId}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger"
        >
          <AlertCircle size={13} />
          {error}
        </span>
      )}
    </div>
  );
}

export const inputClass =
  'h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary-light disabled:bg-surface disabled:text-ink-faint';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      className={cn(inputClass, invalid && 'border-danger focus:border-danger focus:ring-danger-soft', className)}
      {...rest}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, className, children, ...rest }: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        className={cn(inputClass, 'appearance-none pe-9', invalid && 'border-danger', className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}

interface RadioRowProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description?: string;
}

export function RadioRow({ name, value, checked, onChange, title, description }: RadioRowProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors',
        checked ? 'border-primary bg-primary-faint' : 'border-line bg-white hover:border-primary-soft',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
          checked ? 'border-primary-deep' : 'border-line',
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary-deep" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>}
      </span>
    </label>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-white px-3.5 py-3 text-start transition-colors hover:border-primary-soft"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary-deep' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-all',
            checked ? 'start-[22px]' : 'start-0.5',
          )}
        />
      </span>
    </button>
  );
}

interface TextareaLikeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function TextareaLike({ invalid, className, ...rest }: TextareaLikeProps) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-2 focus:ring-primary-light disabled:bg-surface',
        invalid && 'border-danger',
        className,
      )}
      {...rest}
    />
  );
}

interface SegmentedProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}

export function Segmented({ options, value, onChange, ariaLabel }: SegmentedProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex rounded-lg border border-line bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-md px-2 py-1.5 text-[13px] font-semibold transition-colors',
            value === o.value ? 'bg-white text-primary-deep shadow-card' : 'text-ink-soft hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
