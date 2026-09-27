
/** نشان پزشکی مینیمال پزشک‌یار */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <rect width="64" height="64" rx="14" fill="#DDF1FC" />
      <path
        d="M28 14h8a2 2 0 0 1 2 2v10h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H38v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V38H16a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h10V16a2 2 0 0 1 2-2z"
        fill="#174A6B"
      />
      <circle cx="47" cy="17" r="4" fill="#74B9E8" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[19px] font-black tracking-tight text-ink">پزشک‌یار</span>
        <span className="mt-1 text-[10px] font-medium text-ink-faint">رزرو هوشمند نوبت پزشکی</span>
      </span>
    </span>
  );
}
