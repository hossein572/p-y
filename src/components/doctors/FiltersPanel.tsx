import { specialties } from '../../data/specialties';
import { doctorCountBySpecialty } from '../../data/doctors';
import { cities } from '../../data/cities';
import { Select, Toggle, Segmented } from '../ui/Field';
import { cn, toFa } from '../../lib/utils';

export interface FilterState {
  q: string;
  specialty: string;
  city: string;
  price: string; // '', 'lt400', '400-600', 'gt600'
  rating: string; // '', '4', '4.5'
  gender: string; // '', 'm', 'f'
  when: string; // '', 'today', 'tomorrow', 'week'
  online: boolean;
}

export const emptyFilters: FilterState = {
  q: '',
  specialty: '',
  city: '',
  price: '',
  rating: '',
  gender: '',
  when: '',
  online: false,
};

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.specialty) n++;
  if (f.city) n++;
  if (f.price) n++;
  if (f.rating) n++;
  if (f.gender) n++;
  if (f.when) n++;
  if (f.online) n++;
  return n;
}

interface FiltersPanelProps {
  value: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

/** پنل فیلترها — مشترک بین سایدبار دسکتاپ و BottomSheet موبایل */
export function FiltersPanel({ value, onChange, onReset }: FiltersPanelProps) {
  const active = countActiveFilters(value);

  return (
    <div className="flex flex-col gap-5">
      {active > 0 && (
        <button
          onClick={onReset}
          className="self-end text-xs font-bold text-danger transition-colors hover:text-[#b04545]"
        >
          حذف فیلترها ({toFa(active)})
        </button>
      )}

      {/* تخصص */}
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold text-ink">تخصص</legend>
        <div className="max-h-56 space-y-0.5 overflow-y-auto pe-1">
          {specialties.map((s) => {
            const checked = value.specialty === s.id;
            return (
              <label
                key={s.id}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors',
                  checked ? 'bg-primary-faint' : 'hover:bg-primary-faint/60',
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange({ specialty: checked ? '' : s.id })}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'grid h-[18px] w-[18px] shrink-0 place-items-center rounded border transition-colors',
                      checked ? 'border-primary-deep bg-primary-deep' : 'border-line bg-white',
                    )}
                  >
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={cn('truncate text-[13px]', checked ? 'font-bold text-ink' : 'text-ink-soft')}>
                    {s.name}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] text-ink-faint">{toFa(doctorCountBySpecialty(s.id))}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* شهر */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-ink" htmlFor="f-city">
          شهر
        </label>
        <Select id="f-city" value={value.city} onChange={(e) => onChange({ city: e.target.value })}>
          <option value="">همه شهرها</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* قیمت */}
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold text-ink">قیمت ویزیت</legend>
        <div className="space-y-1.5">
          {[
            { v: '', label: 'همه قیمت‌ها' },
            { v: 'lt400', label: 'تا ۴۰۰ هزار تومان' },
            { v: '400-600', label: '۴۰۰ تا ۶۰۰ هزار تومان' },
            { v: 'gt600', label: 'بیش از ۶۰۰ هزار تومان' },
          ].map((o) => (
            <label key={o.v} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1">
              <input
                type="radio"
                name="price"
                checked={value.price === o.v}
                onChange={() => onChange({ price: o.v })}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'grid h-[18px] w-[18px] place-items-center rounded-full border-2 transition-colors',
                  value.price === o.v ? 'border-primary-deep' : 'border-line',
                )}
              >
                {value.price === o.v && <span className="h-2 w-2 rounded-full bg-primary-deep" />}
              </span>
              <span className="text-[13px] text-ink-soft">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* امتیاز */}
      <fieldset>
        <legend className="mb-2 text-[13px] font-bold text-ink">امتیاز پزشک</legend>
        <div className="space-y-1.5">
          {[
            { v: '', label: 'همه' },
            { v: '4', label: '۴ به بالا' },
            { v: '4.5', label: '۴٫۵ به بالا' },
          ].map((o) => (
            <label key={o.v} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1">
              <input
                type="radio"
                name="rating"
                checked={value.rating === o.v}
                onChange={() => onChange({ rating: o.v })}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  'grid h-[18px] w-[18px] place-items-center rounded-full border-2 transition-colors',
                  value.rating === o.v ? 'border-primary-deep' : 'border-line',
                )}
              >
                {value.rating === o.v && <span className="h-2 w-2 rounded-full bg-primary-deep" />}
              </span>
              <span className="text-[13px] text-ink-soft">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* جنسیت */}
      <div>
        <span className="mb-2 block text-[13px] font-bold text-ink">جنسیت پزشک</span>
        <Segmented
          ariaLabel="جنسیت پزشک"
          value={value.gender}
          onChange={(gender) => onChange({ gender })}
          options={[
            { value: '', label: 'همه' },
            { value: 'f', label: 'خانم' },
            { value: 'm', label: 'آقا' },
          ]}
        />
      </div>

      {/* زمان */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-ink" htmlFor="f-when">
          زمان مراجعه
        </label>
        <Select id="f-when" value={value.when} onChange={(e) => onChange({ when: e.target.value })}>
          <option value="">هر زمان</option>
          <option value="today">امروز</option>
          <option value="tomorrow">فردا</option>
          <option value="week">این هفته</option>
        </Select>
      </div>

      {/* آنلاین */}
      <Toggle
        checked={value.online}
        onChange={(online) => onChange({ online })}
        label="فقط مشاوره آنلاین"
        description="پزشکانی که ویزیت ویدئویی ارائه می‌دهند"
      />
    </div>
  );
}
