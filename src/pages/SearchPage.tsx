import {useCallback, useMemo, useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { doctors } from '../data/doctors';
import { specialtyById } from '../data/specialties';
import { cityById } from '../data/cities';
import { DoctorRow } from '../components/doctors/DoctorRow';
import { FiltersPanel, FilterState, countActiveFilters } from '../components/doctors/FiltersPanel';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Field';
import { toFa } from '../lib/utils';

function readFilters(params: URLSearchParams): FilterState {
  return {
    q: params.get('q') ?? '',
    specialty: params.get('specialty') ?? '',
    city: params.get('city') ?? '',
    price: params.get('price') ?? '',
    rating: params.get('rating') ?? '',
    gender: params.get('gender') ?? '',
    when: params.get('when') ?? '',
    online: params.get('online') === '1',
  };
}

function writeFilters(params: URLSearchParams, f: FilterState) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.specialty) p.set('specialty', f.specialty);
  if (f.city) p.set('city', f.city);
  if (f.price) p.set('price', f.price);
  if (f.rating) p.set('rating', f.rating);
  if (f.gender) p.set('gender', f.gender);
  if (f.when) p.set('when', f.when);
  if (f.online) p.set('online', '1');
  const sort = params.get('sort');
  if (sort) p.set('sort', sort);
  return p;
}

function DoctorSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex gap-4">
        <Skeleton className="h-[104px] w-[104px] rounded-xl" />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="ms-auto h-8 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  usePageTitle('جستجوی پزشک');
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const sort = params.get('sort') ?? 'popular';
  const loading = useSimulatedLoading(600);
  const [sheetOpen, setSheetOpen] = useState(false);

  const setFilter = useCallback(
    (patch: Partial<FilterState>) => {
      const next = { ...filters, ...patch };
      setParams(writeFilters(params, next), { replace: true });
    },
    [filters, params, setParams],
  );

  const reset = useCallback(() => {
    const p = new URLSearchParams();
    const s = params.get('sort');
    if (s && s !== 'popular') p.set('sort', s);
    setParams(p, { replace: true });
  }, [params, setParams]);

  const results = useMemo(() => {
    let list = doctors.filter((d) => {
      if (filters.q) {
        const q = filters.q.trim();
        const specName = specialtyById(d.specialtyId)?.name ?? '';
        if (!d.name.includes(q) && !specName.includes(q)) return false;
      }
      if (filters.specialty && d.specialtyId !== filters.specialty) return false;
      if (filters.city && d.cityId !== filters.city) return false;
      if (filters.price === 'lt400' && d.priceFrom >= 400000) return false;
      if (filters.price === '400-600' && (d.priceFrom < 400000 || d.priceFrom > 600000)) return false;
      if (filters.price === 'gt600' && d.priceFrom <= 600000) return false;
      if (filters.rating && d.rating < Number(filters.rating)) return false;
      if (filters.gender && d.gender !== filters.gender) return false;
      if (filters.when === 'today' && d.nextFree.label !== 'امروز') return false;
      if (filters.when === 'tomorrow' && d.nextFree.label !== 'فردا') return false;
      if (filters.online && !d.services.some((s) => s.type === 'online')) return false;
      return true;
    });

    switch (sort) {
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'priceAsc':
        list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case 'priceDesc':
        list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case 'experience':
        list = [...list].sort((a, b) => b.experience - a.experience);
        break;
      default:
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [filters, sort]);

  const activeCount = countActiveFilters(filters);
  const title = filters.specialty
    ? `پزشکان ${specialtyById(filters.specialty)?.name ?? ''}`
    : filters.city
      ? `پزشکان ${cityById(filters.city)?.name ?? ''}`
      : 'جستجوی پزشک';

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      {/* سربرگ */}
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {loading ? 'در حال بارگذاری…' : `${toFa(results.length)} پزشک یافت شد`}
        </p>
      </div>

      {/* جستجو + دکمه فیلتر موبایل */}
      <div className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input
            value={filters.q}
            onChange={(e) => setFilter({ q: e.target.value })}
            placeholder="جستجوی نام پزشک یا تخصص…"
            className="ps-10"
            aria-label="جستجوی پزشک"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSheetOpen(true)}
          className="relative shrink-0 lg:hidden"
          aria-label={`فیلترها${activeCount ? `، ${activeCount} فعال` : ''}`}
        >
          <SlidersHorizontal size={16} />
          فیلترها
          {activeCount > 0 && (
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-primary-deep px-1 text-[11px] font-bold text-white">
              {toFa(activeCount)}
            </span>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* سایدبار دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-ink">
              <Filter size={15} className="text-primary-deep" />
              فیلترها
            </h2>
            <FiltersPanel value={filters} onChange={setFilter} onReset={reset} />
          </div>
        </aside>

        {/* نتایج */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-[13px] text-ink-soft">
              {loading ? 'در حال جستجو…' : `${toFa(results.length)} پزشک`}
            </span>
            <label className="flex items-center gap-2 text-[13px] text-ink-soft">
              <span className="hidden sm:inline">مرتب‌سازی:</span>
              <select
                value={sort}
                onChange={(e) => {
                  const p = new URLSearchParams(params);
                  if (e.target.value === 'popular') p.delete('sort');
                  else p.set('sort', e.target.value);
                  setParams(p, { replace: true });
                }}
                aria-label="مرتب‌سازی نتایج"
                className="h-9 cursor-pointer rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="popular">محبوب‌ترین</option>
                <option value="rating">بیشترین امتیاز</option>
                <option value="priceAsc">کمترین قیمت</option>
                <option value="priceDesc">بیشترین قیمت</option>
                <option value="experience">بیشترین سابقه</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="space-y-4">
              <DoctorSkeleton />
              <DoctorSkeleton />
              <DoctorSkeleton />
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white shadow-card">
              <EmptyState
                icon={<SearchX size={26} />}
                title="پزشکی با این مشخصات پیدا نشد"
                description="فیلترها را تغییر دهید یا محدوده جستجو را بازتر کنید؛ احتمالاً پزشک مورد نظرتان در یکی از شهرهای دیگر است."
                action={
                  <Button variant="outline" onClick={reset}>
                    حذف همه فیلترها
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((d) => (
                <DoctorRow key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BottomSheet فیلتر موبایل */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="فیلترها"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={reset}>
              پاک کردن
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              اعمال و مشاهده {toFa(results.length)} پزشک
            </Button>
          </div>
        }
      >
        <FiltersPanel value={filters} onChange={setFilter} onReset={reset} />
      </BottomSheet>
    </div>
  );
}
