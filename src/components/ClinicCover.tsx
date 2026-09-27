import React from 'react';
import { cn } from '../lib/utils';

interface ClinicCoverProps {
  index: number;
  className?: string;
}

/**
 * روکاور برند کلینیک‌ها:
 * یک سیستم تصویرسازی خطی و منسجم (نه عکس استوک) برای هر کلینیک.
 *
 * هر کلینیک با ترکیب متفاوتی از طبقات، برج کناری و درخت نمایش داده می‌شود.
 */
export function ClinicCover({ index, className }: ClinicCoverProps) {
  const floors = [3, 4, 2, 5, 3, 4, 2, 4, 3, 5][index % 10];
  const tower = index % 3 === 0;
  const tree = index % 2 === 1;

  const h = 44 + floors * 24;
  const top = 188 - h;

  const windows: React.ReactNode[] = [];
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < 4; c++) {
      windows.push(
        <rect
          key={`${f}-${c}`}
          x={134 + c * 34}
          y={top + 16 + f * 24}
          width={20}
          height={13}
          rx={2}
          fill="#DDF1FC"
          stroke="#174A6B"
          strokeWidth={1}
          opacity={0.85}
        />,
      );
    }
  }

  const dots: React.ReactNode[] = [];
  for (let x = 24; x <= 376; x += 36) {
    for (let y = 24; y <= 168; y += 36) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill="#C4E5F7" />);
    }
  }

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-gradient-to-b from-primary-faint to-white', className)}
      aria-hidden
    >
      <svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        <g opacity={0.7}>{dots}</g>
        <g stroke="#174A6B" strokeWidth={1.6} fill="none" opacity={0.42} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="188" x2="382" y2="188" />
          {/* ساختمان اصلی */}
          <rect x="120" y={top} width="160" height={h} rx="3" fill="#FFFFFF" fillOpacity={0.55} />
          {windows}
          {/* در ورودی */}
          <rect x="188" y="164" width="24" height="24" rx="2" fill="#DDF1FC" fillOpacity={0.9} />
          <line x1="200" y1="164" x2="200" y2="188" />
          {/* تابلوی صلیب پزشکی */}
          <rect x="180" y={top - 24} width="40" height="17" rx="3" fill="#FFFFFF" fillOpacity={0.8} />
          <path d={`M200 ${top - 20}v9M195.5 ${top - 15.5}h9`} />
          {/* برج کناری */}
          {tower && (
            <>
              <rect x="98" y={top + 28} width="22" height={h - 28} rx="2" fill="#FFFFFF" fillOpacity={0.4} />
              {Array.from({ length: Math.max(0, floors - 1) }).map((_, i) => (
                <rect key={i} x={104} y={top + 40 + i * 24} width={10} height={12} rx={1.5} fill="#DDF1FC" />
              ))}
            </>
          )}
          {/* درخت */}
          {tree && (
            <g>
              <line x1="330" y1="188" x2="330" y2="158" />
              <path d="M330 158c-4-2-6-5-6-9 0-7 6-12 12-12 7 0 12 5 12 12 0 4-2 7-6 9" />
            </g>
          )}
          {/* پرچم کوچک */}
          <line x1="62" y1="188" x2="62" y2="150" />
          <path d="M62 152h16l-5 5 5 5H62z" fill="#DDF1FC" />
        </g>
      </svg>
    </div>
  );
}
