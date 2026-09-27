import { CalendarOff } from 'lucide-react';
import { JDate, JALALI_MONTHS, MORNING_SLOTS, EVENING_SLOTS, isSlotBooked, faTime } from '../../lib/jalali';
import { cn, toFa } from '../../lib/utils';

interface TimeSlotsProps {
  doctorId: string;
  date: JDate;
  value: string | null;
  onChange: (t: string) => void;
}

function SlotGroup({
  title,
  slots,
  seed,
  value,
  onChange,
}: {
  title: string;
  slots: string[];
  seed: string;
  value: string | null;
  onChange: (t: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-2.5 text-[13px] font-bold text-ink">{title}</h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((t) => {
          const booked = isSlotBooked(seed, t);
          const selected = value === t;
          return (
            <button
              key={t}
              type="button"
              disabled={booked}
              onClick={() => onChange(t)}
              aria-pressed={selected}
              aria-label={booked ? `${faTime(t)}، نوبت پر است` : `ساعت ${faTime(t)}`}
              className={cn(
                'h-11 rounded-lg border text-[13px] font-bold tabular-nums transition-all',
                booked &&
                  'cursor-not-allowed border-line bg-surface text-ink-faint/50 line-through decoration-ink-faint/40',
                !booked && !selected && 'border-line bg-white text-ink hover:border-primary hover:bg-primary-faint',
                selected && 'border-primary-deep bg-primary-deep text-white shadow-card',
              )}
            >
              {faTime(t)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** انتخاب ساعت نوبت */
export function TimeSlots({ doctorId, date, value, onChange }: TimeSlotsProps) {
  const seed = `${doctorId}|${date.jy}-${date.jm}-${date.jd}`;
  const freeCount = [...MORNING_SLOTS, ...EVENING_SLOTS].filter((t) => !isSlotBooked(seed, t)).length;

  return (
    <div className="space-y-5 rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-bold text-ink">
          {toFa(date.jd)} {JALALI_MONTHS[date.jm - 1]}
        </span>
        <span className={cn('font-bold', freeCount > 0 ? 'text-success' : 'text-danger')}>
          {freeCount > 0 ? `${toFa(freeCount)} ساعت آزاد` : 'ساعتی آزاد نیست'}
        </span>
      </div>

      {freeCount === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface py-8 text-center">
          <CalendarOff size={26} className="text-ink-faint" />
          <p className="text-[13px] leading-6 text-ink-soft">
            تمام ساعات این روز پر شده است.
            <br />
            لطفاً روز دیگری را انتخاب کنید.
          </p>
        </div>
      ) : (
        <>
          <SlotGroup title="صبح" slots={MORNING_SLOTS} seed={seed} value={value} onChange={onChange} />
          <SlotGroup title="بعدازظهر" slots={EVENING_SLOTS} seed={seed} value={value} onChange={onChange} />
        </>
      )}
    </div>
  );
}
