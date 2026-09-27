import React from 'react';
import { cn } from '../../lib/utils';

type Tone = 'success' | 'info' | 'warn' | 'danger' | 'neutral' | 'deep';

const tones: Record<Tone, string> = {
  success: 'bg-success-soft text-[#1F6B51]',
  info: 'bg-primary-light text-primary-deep',
  warn: 'bg-warn-soft text-[#8A5E1C]',
  danger: 'bg-danger-soft text-[#A03E3E]',
  neutral: 'bg-surface text-ink-soft border border-line',
  deep: 'bg-primary-deep text-white',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold leading-5',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
