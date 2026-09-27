import {useMemo, useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  JDate,
  WEEKDAYS_SHORT,
  monthCells,
  monthName,
  weekdayOf,
  isSame,
  daysInMonth,
} from '../../lib/jalali';
import { cn, toFa } from '../../lib/utils';

interface JalaliCalendarProps {
  value: JDate | null;
  onChange: (d: JDate) => void;
  min: JDate;
  max: JDate;
}

function after(a: JDate, b: JDate): boolean {
  return a.jy > b.jy || (a.jy === b.jy && (a.jm > b.jm || (a.jm === b.jm && a.jd > b.jd)));
}

function before(a: JDate, b: JDate): boolean {
  return after(b, a);
}

/** آیا ماه انتخابی با بازه min..max تقاطع دارد؟ */
function monthHasSelectable(jy: number, jm: number, min: JDate, max: JDate): boolean {
  const first: JDate = { jy, jm, jd: 1 };
  const last: JDate = { jy, jm, jd: daysInMonth(jy, jm) };
  return !after(first, max) && !before(last, min);
}

/** تقویم جلالی برای انتخاب تاریخ نوبت */
export function JalaliCalendar({ value, onChange, min, max }: JalaliCalendarProps) {
  const [view, setView] = useState({ jy: (value ?? min).jy, jm: (value ?? min).jm });

  const cells = useMemo(() => monthCells(view.jy, view.jm), [view.jy, view.jm]);

  const prevJm = view.jm === 1 ? 12 : view.jm - 1;
  const prevJy = view.jm === 1 ? view.jy - 1 : view.jy;
  const nextJm = view.jm === 12 ? 1 : view.jm + 1;
  const nextJy = view.jm === 12 ? view.jy + 1 : view.jy;
  const canPrev = monthHasSelectable(prevJy, prevJm, min, max);
  const canNext = monthHasSelectable(nextJy, nextJm, min, max);

  function shiftMonth(delta: number) {
    setView((v) => {
      let jm = v.jm + delta;
      let jy = v.jy;
      if (jm < 1) {
        jm = 12;
        jy -= 1;
      }
      if (jm > 12) {
        jm = 1;
        jy += 1;
      }
      return { jy, jm };
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      {/* سربرگ ماه */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canPrev}
          aria-label="ماه قبلی"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-primary hover:text-primary-deep disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>
        <div className="text-sm font-extrabold text-ink">{monthName({ jy: view.jy, jm: view.jm, jd: 1 })}</div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={!canNext}
          aria-label="ماه بعد"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-primary hover:text-primary-deep disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>
      </div>

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS_SHORT.map((w, i) => (
          <div key={w} className={cn('py-1.5 text-center text-[11px] font-bold', i === 6 ? 'text-danger/60' : 'text-ink-faint')}>
            {w}
          </div>
        ))}

        {cells.map(({ j, inMonth }) => {
          const isPast = j.jy < min.jy || (j.jy === min.jy && (j.jm < min.jm || (j.jm === min.jm && j.jd < min.jd)));
          const isFuture =
            j.jy > max.jy || (j.jy === max.jy && (j.jm > max.jm || (j.jm === max.jm && j.jd > max.jd)));
          const isFriday = weekdayOf(j) === 6;
          const disabled = isPast || isFuture || isFriday;
          const selected = isSame(j, value);
          const isToday = isSame(j, min);

          return (
            <button
              key={`${j.jy}-${j.jm}-${j.jd}`}
              type="button"
              disabled={disabled}
              onClick={() => onChange(j)}
              aria-pressed={selected}
              aria-label={`${toFa(j.jd)} ${''}${isFriday ? ' (جمعه، مرخصی)' : ''}`}
              className={cn(
                'relative mx-auto grid h-10 w-10 place-items-center rounded-lg text-[13px] font-medium transition-colors',
                !inMonth && 'text-ink-faint/50',
                inMonth && !disabled && !selected && 'text-ink hover:bg-primary-light',
                disabled && inMonth && 'text-ink-faint/40',
                isToday && !selected && 'font-black text-primary-deep ring-1 ring-primary-soft',
                selected && 'bg-primary-deep font-black text-white shadow-card',
              )}
            >
              {toFa(j.jd)}
              {isFriday && inMonth && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-danger/40" aria-hidden />}
            </button>
          );
        })}
      </div>

      {/* راهنما */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-[11px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-primary-deep" aria-hidden />
          انتخاب‌شده
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-1 ring-primary-soft" aria-hidden />
          امروز
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-danger/50" aria-hidden />
          جمعه (مرخصی)
        </span>
      </div>
    </div>
  );
}
