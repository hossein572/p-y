import { Star } from 'lucide-react';
import { cn, toFa } from '../../lib/utils';

interface StarsProps {
  value: number;
  size?: number;
  className?: string;
}

/** نمایش ستاره‌ها (بدون اعشار، ساده و خوانا) */
export function Stars({ value, size = 13, className }: StarsProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`امتیاز ${toFa(value)} از ۵`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i <= Math.round(value) ? 'fill-[#F0B441] text-[#F0B441]' : 'fill-line text-line'}
        />
      ))}
    </span>
  );
}

interface RatingRowProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

/** امتیاز + تعداد نظر */
export function RatingRow({ value, count, size = 13, className }: RatingRowProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-ink-soft', className)}>
      <Stars value={value} size={size} />
      <span className="text-[13px] font-bold text-ink">{toFa(value)}</span>
      {typeof count === 'number' && <span>({toFa(count)})</span>}
    </span>
  );
}
