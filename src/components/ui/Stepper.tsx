import { Check } from 'lucide-react';
import { cn, toFa } from '../../lib/utils';

interface StepperProps {
  steps: string[];
  current: number;
}

/** نوار مراحل رزرو: دسکتاپ = گام‌شمار، موبایل = نوار پیشرفت */
export function Stepper({ steps, current }: StepperProps) {
  const pct = ((current + 1) / steps.length) * 100;

  return (
    <div>
      {/* دسکتاپ */}
      <ol className="hidden items-center gap-2 md:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-bold transition-colors',
                    done && 'border-primary-deep bg-primary-deep text-white',
                    active && 'border-primary-deep bg-white text-primary-deep',
                    !done && !active && 'border-line bg-white text-ink-faint',
                  )}
                >
                  {done ? <Check size={15} /> : toFa(i + 1)}
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-[13px] font-semibold',
                    active ? 'text-ink' : done ? 'text-ink-soft' : 'text-ink-faint',
                  )}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden className={cn('h-px flex-1', i < current ? 'bg-primary-deep' : 'bg-line')} />
              )}
            </li>
          );
        })}
      </ol>

      {/* موبایل */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-bold text-ink">
            مرحله {toFa(current + 1)} از {toFa(steps.length)}: {steps[current]}
          </span>
          <span className="text-ink-soft">{toFa(Math.round(pct))}٪</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-primary-deep transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
