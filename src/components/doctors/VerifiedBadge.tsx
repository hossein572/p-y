import { BadgeCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

/** نشان پزشک تأییدشده */
export function VerifiedBadge({ onImage, className }: { onImage?: boolean; className?: string }) {
  if (onImage) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-1 text-[10px] font-bold text-primary-deep shadow-card backdrop-blur',
          className,
        )}
      >
        <BadgeCheck size={12} className="text-primary-600" />
        تأیید شده
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold text-primary-700', className)}>
      <BadgeCheck size={13} />
      تأیید شده
    </span>
  );
}
