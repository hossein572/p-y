import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionTo?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeader({ title, description, actionTo, actionLabel, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="text-xl font-extrabold text-ink md:text-2xl">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-ink-soft">{description}</p>}
      </div>
      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep transition-colors hover:text-[#123c56]"
        >
          {actionLabel}
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
