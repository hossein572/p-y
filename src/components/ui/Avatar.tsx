import {useState} from 'react';
import { avatarTone, initialsOf, cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  /** اندازه ثابت (پیکسل) — برای آواتارهای دایره‌ای کوچک */
  size?: number;
  /** پرکردن ظرف (بدون اندازه ثابت) — برای عکس‌های بزرگ پزشک */
  fluid?: boolean;
  shape?: 'circle' | 'square';
  className?: string;
}

/**
 * تصویر با FALLBACK به مونوگرام:
 * اگر تصویر موجود نبود یا خطا داد، ابتداکلی نام با tone اختصاصی نمایش داده می‌شود.
 */
export function Avatar({ name, src, size, fluid, shape = 'circle', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const tone = avatarTone(name);
  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn('shrink-0 border border-line object-cover', rounded, !size && fluid && 'h-full w-full', className)}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  if (size) {
    return (
      <span
        aria-hidden
        className={cn('grid shrink-0 select-none place-items-center border', rounded, className)}
        style={{
          width: size,
          height: size,
          backgroundColor: tone.bg,
          color: tone.fg,
          borderColor: tone.bg,
          fontSize: Math.max(11, Math.round(size * 0.34)),
          fontWeight: 700,
        }}
      >
        {initialsOf(name)}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'grid select-none place-items-center border text-xl font-bold sm:text-2xl',
        rounded,
        className,
      )}
      style={{ backgroundColor: tone.bg, color: tone.fg, borderColor: tone.bg }}
    >
      {initialsOf(name)}
    </span>
  );
}
