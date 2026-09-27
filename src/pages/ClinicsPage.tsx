import {useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Search, Star, Users } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { clinics } from '../data/clinics';
import { cityById } from '../data/cities';
import { specialtyById } from '../data/specialties';
import { ClinicCover } from '../components/ClinicCover';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Input, Select } from '../components/ui/Field';
import { toFa } from '../lib/utils';

function ClinicSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ClinicsPage() {
  usePageTitle('کلینیک‌ها');
  const loading = useSimulatedLoading(550);
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () =>
      clinics.filter((c) => {
        if (city && c.cityId !== city) return false;
        if (q && !c.name.includes(q.trim())) return false;
        return true;
      }),
    [city, q],
  );

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">کلینیک‌های پزشک‌یار</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {toFa(clinics.length)} کلینیک معتبر در {toFa(8)} شهر، با ویزیت تخصصی و تجهیزات به‌روز
        </p>
      </div>

      {/* کنترل‌ها */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی نام کلینیک…" className="ps-10" aria-label="جستجوی کلینیک" />
        </div>
        <Select value={city} onChange={(e) => setCity(e.target.value)} className="w-40" aria-label="فیلتر بر اساس شهر">
          <option value="">همه شهرها</option>
          {Array.from(new Set(clinics.map((c) => c.cityId))).map((id) => (
            <option key={id} value={id}>
              {cityById(id)?.name}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClinicSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <EmptyState
            icon={<Building2 size={26} />}
            title="کلینیکی با این مشخصات پیدا نشد"
            description="شهر دیگری را انتخاب کنید یا نام کلینیک را بازبینی کنید."
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const idx = clinics.indexOf(c);
            const cityInfo = cityById(c.cityId);
            const specs = c.specialtyIds.slice(0, 3);
            return (
              <article
                key={c.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-card-hover"
              >
                <div className="relative h-40 overflow-hidden">
                  <ClinicCover index={idx} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-[11px] font-black text-ink shadow-card backdrop-blur">
                    <Star size={12} className="fill-[#F0B441] text-[#F0B441]" strokeWidth={0} />
                    {toFa(c.rating)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[15px] font-extrabold text-ink">{c.name}</h2>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-ink-soft">
                      <MapPin size={12} className="text-ink-faint" />
                      {cityInfo?.name}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-soft">{c.address}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {specs.map((s) => (
                      <Badge key={s} tone="info">
                        {specialtyById(s)?.name}
                      </Badge>
                    ))}
                    {c.specialtyIds.length > 3 && <Badge tone="neutral">+{toFa(c.specialtyIds.length - 3)}</Badge>}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
                    <Users size={13} className="text-primary-700" />
                    {toFa(c.doctorIds.length)} پزشک فعال
                  </div>
                  <Link to={`/clinics/${c.id}`} className="mt-4">
                    <Button variant="outline" size="sm" block>
                      مشاهده کلینیک
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
