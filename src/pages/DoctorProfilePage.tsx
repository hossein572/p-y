import {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Award,
  Briefcase,
  CalendarPlus,
  ChevronLeft,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  Quote,
  RefreshCw,
  ShieldCheck,
  Star,
  Video,
} from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { doctorById } from '../data/doctors';
import { specialtyById } from '../data/specialties';
import { cityById } from '../data/cities';
import { clinicById } from '../data/clinics';
import { reviewsByDoctor } from '../data/reviews';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Stars } from '../components/ui/Rating';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { FavoriteButton } from '../components/doctors/FavoriteButton';
import { VerifiedBadge } from '../components/doctors/VerifiedBadge';
import { NotFoundContent } from '../components/NotFoundContent';
import {
  MORNING_SLOTS,
  EVENING_SLOTS,
  JALALI_MONTHS,
  WEEKDAYS,
  addDays,
  isSlotBooked,
  today,
  weekdayOf,
} from '../lib/jalali';
import { cn, formatPrice, toFa } from '../lib/utils';

const serviceIcon = {
  'in-person': MapPin,
  online: Video,
  'follow-up': RefreshCw,
  special: Award,
};

const serviceLabel = {
  'in-person': 'حضوری',
  online: 'آنلاین',
  'follow-up': 'پیگیری',
  special: 'تخصصی',
};

type TabId = 'about' | 'services' | 'availability' | 'reviews';

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-container px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-6">
      <Skeleton className="mb-5 h-3 w-40" />
      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="h-48 w-48 self-center rounded-2xl md:self-start" />
          <div className="flex-1 space-y-4 py-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-2xl md:w-64" />
        </div>
      </div>
    </div>
  );
}

export function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const doctor = doctorById(id ?? '');
  const loading = useSimulatedLoading(450, [id]);
  usePageTitle(doctor?.name);

  const [tab, setTab] = useState<TabId>('about');
  useEffect(() => setTab('about'), [id]);

  if (!doctor) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
        <NotFoundContent title="پزشک مورد نظر پیدا نشد" />
      </div>
    );
  }

  if (loading) return <ProfileSkeleton />;

  const specialty = specialtyById(doctor.specialtyId);
  const city = cityById(doctor.cityId);
  const clinic = clinicById(doctor.clinicId);
  const docReviews = reviewsByDoctor(doctor.id);

  // توزیع ستاره‌ها (تقریبی و قطعی)
  const p5 = Math.min(95, Math.round(((doctor.rating - 3) / 2) * 100));
  const rest = 100 - p5;
  const dist = [p5, Math.round(rest * 0.6), Math.round(rest * 0.25), Math.max(1, Math.round(rest * 0.1)), 0];
  dist[4] = Math.max(0, 100 - dist[0] - dist[1] - dist[2] - dist[3]);

  // روزهای آزاد هفته (جمعه مرخصی)
  const week = addDays(today(), 1);
  const days = Array.from({ length: 12 }, (_, i) => addDays(week, i))
    .filter((d) => weekdayOf(d) !== 6)
    .slice(0, 7);

  const allSlots = [...MORNING_SLOTS, ...EVENING_SLOTS];

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'about', label: 'درباره پزشک' },
    { id: 'services', label: 'خدمات', count: doctor.services.length },
    { id: 'availability', label: 'نوبت‌ها' },
    { id: 'reviews', label: 'نظرات', count: doctor.reviewCount },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-container px-4 py-5 sm:px-6 lg:px-8">
        {/* نوار خشکبار */}
        <nav aria-label="مسیر" className="mb-4 flex items-center gap-1.5 text-xs text-ink-faint">
          <Link to="/" className="transition-colors hover:text-ink-soft">
            خانه
          </Link>
          <ChevronLeft size={12} />
          <Link to="/doctors" className="transition-colors hover:text-ink-soft">
            پزشکان
          </Link>
          <ChevronLeft size={12} />
          <span className="truncate font-medium text-ink-soft">{doctor.name}</span>
        </nav>

        {/* کارت اصلی */}
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative mx-auto shrink-0 md:mx-0">
              <Avatar
                name={doctor.name}
                src={doctor.image}
                shape="square"
                fluid
                className="h-40 w-40 rounded-2xl sm:h-48 sm:w-48 lg:h-56 lg:w-56"
              />
              {doctor.verified && (
                <span className="absolute bottom-2.5 start-2.5">
                  <VerifiedBadge onImage />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{doctor.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge tone="info">{specialty?.name}</Badge>
                    <span className="flex items-center gap-1 text-[13px] text-ink-soft">
                      <MapPin size={13} />
                      {city?.name}
                    </span>
                  </div>
                </div>
                <FavoriteButton doctorId={doctor.id} name={doctor.name} className="shrink-0" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-line bg-surface p-3">
                  <div className="text-[11px] font-semibold text-ink-faint">امتیاز بیماران</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-lg font-black text-ink">{toFa(doctor.rating)}</span>
                    <Stars value={doctor.rating} size={12} />
                  </div>
                  <div className="mt-1 text-[11px] text-ink-soft">{toFa(doctor.reviewCount)} نظر</div>
                </div>
                <div className="rounded-xl border border-line bg-surface p-3">
                  <div className="text-[11px] font-semibold text-ink-faint">سابقه</div>
                  <div className="mt-1.5 text-lg font-black text-ink">{toFa(doctor.experience)} سال</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
                    <Briefcase size={11} />
                    تجربه تخصصی
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-surface p-3">
                  <div className="text-[11px] font-semibold text-ink-faint">شماره نظام پزشکی</div>
                  <div className="mt-1.5 text-lg font-black text-ink">{toFa(doctor.licenseNo)}</div>
                  <div className="mt-1 text-[11px] text-success">صادق و فعال</div>
                </div>
                <div className="rounded-xl border border-line bg-surface p-3">
                  <div className="text-[11px] font-semibold text-ink-faint">کلینیک</div>
                  {clinic ? (
                    <Link to={`/clinics/${clinic.id}`} className="mt-1.5 block truncate text-[13px] font-bold text-primary-700 transition-colors hover:text-primary-deep">
                      {clinic.name}
                    </Link>
                  ) : (
                    <div className="mt-1.5 text-[13px] font-bold text-ink">—</div>
                  )}
                  <div className="mt-1 text-[11px] text-ink-soft">{city?.name}</div>
                </div>
              </div>

              <p className="mt-4 hidden text-sm leading-7 text-ink-soft md:line-clamp-2">{doctor.bio}</p>
            </div>

            {/* جعبه قیمت و رزرو */}
            <div className="flex shrink-0 flex-col rounded-2xl border border-line bg-surface p-5 md:w-64 lg:w-72">
              <div className="text-xs font-semibold text-ink-soft">قیمت ویزیت از</div>
              <div className="mt-1 text-2xl font-black text-ink">
                {formatPrice(doctor.priceFrom)} <span className="text-sm font-medium text-ink-soft">تومان</span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-[13px]">
                <Clock size={14} className="shrink-0 text-success" />
                <span className="truncate">
                  اولین نوبت آزاد: <b>{doctor.nextFree.label} {doctor.nextFree.time}</b>
                </span>
              </div>
              <Link to={`/book/${doctor.id}`} className="mt-4 block">
                <Button block size="lg">
                  <CalendarPlus size={17} />
                  دریافت نوبت
                </Button>
              </Link>
              <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-line pt-3 text-[11px] text-ink-faint">
                <ShieldCheck size={12} className="text-success" />
                اطلاعات توسط پزشک‌یار تأیید شده است
              </div>
            </div>
          </div>
        </section>

        {/* تب‌ها */}
        <div className="sticky top-16 z-20 -mx-4 mt-6 border-b border-line bg-surface/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[72px] lg:-mx-8 lg:px-8">
          <div role="tablist" aria-label="بخش‌های پروفایل" className="no-scrollbar flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative whitespace-nowrap px-4 py-3.5 text-sm font-semibold transition-colors',
                  tab === t.id ? 'text-primary-deep' : 'text-ink-soft hover:text-ink',
                )}
              >
                {t.label}
                {typeof t.count === 'number' && (
                  <span
                    className={cn(
                      'ms-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                      tab === t.id ? 'bg-primary-light text-primary-deep' : 'bg-surface text-ink-faint',
                    )}
                  >
                    {toFa(t.count)}
                  </span>
                )}
                {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-deep" aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          {/* درباره */}
          {tab === 'about' && (
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
                  <h2 className="text-base font-extrabold text-ink">درباره {doctor.name}</h2>
                  <p className="mt-3 text-sm leading-8 text-ink-soft">{doctor.bio}</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
                  <h2 className="flex items-center gap-2 text-base font-extrabold text-ink">
                    <GraduationCap size={17} className="text-primary-700" />
                    مدرک و تحصیلات
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {doctor.education.map((e) => (
                      <li key={e} className="flex items-start gap-2.5 text-sm leading-7 text-ink-soft">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        {e}
                      </li>
                    ))}
                  </ul>
                  {doctor.achievements.length > 0 && (
                    <>
                      <h3 className="mt-6 text-sm font-bold text-ink">عضویت و افتخارات</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {doctor.achievements.map((a) => (
                          <li key={a}>
                            <Badge tone="info">{a}</Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <h2 className="text-base font-extrabold text-ink">اطلاعات تماس</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary-700" />
                    <div>
                      <dt className="font-bold text-ink">آدرس</dt>
                      <dd className="mt-1 leading-6 text-ink-soft">{doctor.address}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 shrink-0 text-primary-700" />
                    <div>
                      <dt className="font-bold text-ink">تلفن کلینیک</dt>
                      <dd className="mt-1 text-ink-soft" dir="ltr">
                        {clinic?.phone ?? '—'}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="mt-0.5 shrink-0 text-primary-700" />
                    <div>
                      <dt className="font-bold text-ink">ساعات کاری</dt>
                      <dd className="mt-1 text-ink-soft">شنبه تا چهارشنبه ۰۹:۰۰ تا ۱۸:۳۰</dd>
                    </div>
                  </div>
                </dl>
                {clinic && (
                  <Link to={`/clinics/${clinic.id}`} className="mt-5 block">
                    <Button variant="outline" size="sm" block>
                      مشاهده {clinic.name}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* خدمات */}
          {tab === 'services' && (
            <div className="space-y-3">
              {doctor.services.map((s) => {
                const Icon = serviceIcon[s.type];
                return (
                  <div
                    key={s.id}
                    className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-primary-soft sm:flex-row sm:items-center sm:p-5"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary-deep">
                      <Icon size={19} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-ink">{s.name}</h3>
                        <Badge tone={s.type === 'online' ? 'info' : 'neutral'}>{serviceLabel[s.type]}</Badge>
                        <span className="flex items-center gap-1 text-xs text-ink-soft">
                          <Clock size={12} />
                          {toFa(s.duration)} دقیقه
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{s.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="text-end">
                        <span className="text-[15px] font-extrabold text-ink">{formatPrice(s.price)}</span>
                        <span className="ms-1 text-[11px] text-ink-soft">تومان</span>
                      </div>
                      <Link to={`/book/${doctor.id}?service=${s.id}`}>
                        <Button size="sm">انتخاب</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* نوبت‌ها */}
          {tab === 'availability' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-ink">زمان‌های آزاد این هفته</h2>
                    <p className="mt-1 text-[13px] text-ink-soft">
                      روزهای جمعه مرخصی است. ساعات هر روز از ۰۹:۰۰ تا ۱۸:۳۰ قابل رزرو است.
                    </p>
                  </div>
                  <Link to={`/book/${doctor.id}`}>
                    <Button size="sm">
                      <CalendarPlus size={15} />
                      رزرو کامل
                    </Button>
                  </Link>
                </div>
                <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-1">
                  {days.map((d) => {
                    const seed = `${doctor.id}|${d.jy}-${d.jm}-${d.jd}`;
                    const free = allSlots.filter((t) => !isSlotBooked(seed, t)).length;
                    return (
                      <Link
                        key={`${d.jm}-${d.jd}`}
                        to={`/book/${doctor.id}`}
                        className="group w-[104px] shrink-0 rounded-xl border border-line bg-surface p-3 text-center transition-all hover:border-primary hover:bg-primary-faint"
                      >
                        <div className="text-[11px] font-semibold text-ink-faint">{WEEKDAYS[weekdayOf(d)]}</div>
                        <div className="mt-1 text-xl font-black text-ink">{toFa(d.jd)}</div>
                        <div className="text-[11px] text-ink-soft">{JALALI_MONTHS[d.jm - 1]}</div>
                        <div className={cn('mt-2 rounded-md py-1 text-[11px] font-bold', free > 0 ? 'bg-success-soft text-[#1F6B51]' : 'bg-danger-soft text-[#A03E3E]')}>
                          {free > 0 ? `${toFa(free)} ساعت آزاد` : 'تمام شد'}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {doctor.services.some((s) => s.type === 'online') && (
                <div className="flex flex-col gap-4 rounded-2xl border border-primary-soft bg-primary-faint p-5 sm:flex-row sm:items-center">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary-deep">
                    <Video size={19} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-ink">ویزیت آنلاین در دسترس است</h3>
                    <p className="mt-1 text-[13px] leading-6 text-ink-soft">
                      اگر زمان حضوری برایتان سخت است، می‌توانید ویزیت ویدئویی را از خانه انجام دهید. لینک جلسه بعد از رزرو برای شما ارسال می‌شود.
                    </p>
                  </div>
                  <Link to={`/book/${doctor.id}`} className="shrink-0">
                    <Button variant="outline" size="sm">
                      رزرو آنلاین
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* نظرات */}
          {tab === 'reviews' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="text-center sm:pe-6 sm:border-e sm:border-line">
                    <div className="text-5xl font-black tracking-tight text-ink">{toFa(doctor.rating)}</div>
                    <div className="mt-2 flex justify-center">
                      <Stars value={doctor.rating} size={16} />
                    </div>
                    <div className="mt-2 text-xs text-ink-soft">{toFa(doctor.reviewCount)} نظر بیماران</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {dist.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-3 text-[11px] font-bold text-ink-soft">{toFa(5 - i)}</span>
                        <Star size={11} className="fill-[#F0B441] text-[#F0B441]" strokeWidth={0} />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                          <div className="h-full rounded-full bg-[#F0B441]" style={{ width: `${p}%` }} />
                        </div>
                        <span className="w-8 text-end text-[11px] text-ink-faint">{toFa(p)}٪</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {docReviews.length === 0 ? (
                <div className="rounded-2xl border border-line bg-white shadow-card">
                  <EmptyState
                    icon={<Quote size={24} />}
                    title="هنوز نظری ثبت نشده است"
                    description="بعد از اولین ویزیت، می‌توانید تجربه خودتان را با بیماران دیگر به اشتراک بگذارید."
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[13px] text-ink-faint">
                    نمایش {toFa(docReviews.length)} از {toFa(doctor.reviewCount)} نظر
                  </p>
                  {docReviews.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.author} size={40} />
                          <div>
                            <div className="text-[13px] font-bold text-ink">{r.author}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-faint">
                              <span>{r.date}</span>
                              <Badge tone="neutral" className="!text-[10px]">
                                {r.visit}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Stars value={r.rating} size={13} />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-ink-soft">{r.text}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA چسبان موبایل */}
      <div
        className="fixed inset-x-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden"
        style={{ bottom: 'calc(68px + env(safe-area-inset-bottom))' }}
      >
        <div>
          <div className="text-[11px] text-ink-soft">از</div>
          <div className="text-[15px] font-extrabold text-ink">
            {formatPrice(doctor.priceFrom)} <span className="text-[11px] font-medium text-ink-soft">تومان</span>
          </div>
        </div>
        <Link to={`/book/${doctor.id}`} className="flex-1">
          <Button block>
            <CalendarPlus size={16} />
            دریافت نوبت
          </Button>
        </Link>
      </div>
    </div>
  );
}
