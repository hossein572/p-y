import { Link, useParams } from 'react-router-dom';
import { Check, ChevronLeft, Clock, MapPin, Navigation, Phone, Star } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { clinicById } from '../data/clinics';
import { cityById } from '../data/cities';
import { specialtyById } from '../data/specialties';
import { doctorById } from '../data/doctors';
import { ClinicCover } from '../components/ClinicCover';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { RatingRow } from '../components/ui/Rating';
import { NotFoundContent } from '../components/NotFoundContent';
import { toFa } from '../lib/utils';

export function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const clinic = clinicById(id ?? '');
  usePageTitle(clinic?.name);

  if (!clinic) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
        <NotFoundContent title="کلینیک مورد نظر پیدا نشد" />
      </div>
    );
  }

  const idx = clinicByIdIndex(clinic.id);
  const city = cityById(clinic.cityId);
  const docs = clinic.doctorIds.map((d) => doctorById(d)).filter(Boolean);

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="مسیر" className="mb-4 flex items-center gap-1.5 text-xs text-ink-faint">
        <Link to="/" className="transition-colors hover:text-ink-soft">
          خانه
        </Link>
        <ChevronLeft size={12} />
        <Link to="/clinics" className="transition-colors hover:text-ink-soft">
          کلینیک‌ها
        </Link>
        <ChevronLeft size={12} />
        <span className="truncate font-medium text-ink-soft">{clinic.name}</span>
      </nav>

      {/* بنر */}
      <div className="relative h-52 overflow-hidden rounded-2xl border border-line shadow-card sm:h-72">
        <ClinicCover index={idx} className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-14">
          <h1 className="text-xl font-extrabold text-white sm:text-2xl">{clinic.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/90">
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {city?.name}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {clinic.hours}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* محتوا */}
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[13px] font-black text-ink shadow-card ring-1 ring-line">
                  <Star size={13} className="fill-[#F0B441] text-[#F0B441]" strokeWidth={0} />
                  {toFa(clinic.rating)}
                </span>
                <RatingRow value={clinic.rating} size={12} className="text-xs" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {clinic.specialtyIds.map((s) => (
                  <Badge key={s} tone="info">
                    {specialtyById(s)?.name}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-8 text-ink-soft">{clinic.description}</p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-extrabold text-ink">امکانات کلینیک</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {clinic.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 rounded-lg bg-surface px-3.5 py-2.5 text-[13px] text-ink-soft">
                  <Check size={15} className="shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-extrabold text-ink">پزشکان این کلینیک ({toFa(docs.length)})</h2>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {docs.map(
                (d) =>
                  d && (
                    <Link
                      key={d.id}
                      to={`/doctors/${d.id}`}
                      className="group w-40 shrink-0 rounded-xl border border-line bg-surface p-3 transition-all hover:border-primary hover:bg-primary-faint"
                    >
                      <div className="flex justify-center">
                        <Avatar name={d.name} src={d.image} size={64} shape="square" />
                      </div>
                      <div className="mt-3 truncate text-center text-[13px] font-bold text-ink transition-colors group-hover:text-primary-deep">
                        {d.name}
                      </div>
                      <div className="mt-0.5 truncate text-center text-[11px] text-ink-soft">
                        {specialtyById(d.specialtyId)?.name}
                      </div>
                    </Link>
                  ),
              )}
            </div>
          </section>
        </div>

        {/* سایدبار */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="text-sm font-extrabold text-ink">اطلاعات تماس</h2>
            <dl className="mt-4 space-y-4 text-[13px]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary-700" />
                <dd className="leading-6 text-ink-soft">{clinic.address}</dd>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-primary-700" />
                <dd dir="ltr" className="text-end leading-6 text-ink-soft">
                  {clinic.phone}
                </dd>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="mt-0.5 shrink-0 text-primary-700" />
                <dd className="leading-6 text-ink-soft">{clinic.hours}</dd>
              </div>
            </dl>
            <a
              href={`tel:${clinic.phone.replace(/[۰-۹]/g, (c) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-ink transition-colors hover:border-primary hover:bg-primary-faint hover:text-primary-deep"
            >
              <Phone size={14} />
              تماس با کلینیک
            </a>
          </section>

          {/* نقشه (نمایشی) */}
          <section className="relative h-48 overflow-hidden rounded-2xl border border-dashed border-primary-soft bg-primary-faint">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-primary-deep shadow-card">
                  <Navigation size={20} />
                </span>
                <div className="mt-3 text-[13px] font-bold text-ink">نمایش روی نقشه</div>
                <div className="mt-1 text-[11px] text-ink-soft">امکان نمایش در نسخه نهایی</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function clinicByIdIndex(id: string): number {
  // برای تنوع روکاور
  const ids = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
  return Math.max(0, ids.indexOf(id));
}
