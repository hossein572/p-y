import {useEffect, useMemo, useState} from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Building2,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { doctorById } from '../data/doctors';
import { specialtyById } from '../data/specialties';
import { cityById } from '../data/cities';
import { clinicById } from '../data/clinics';
import type { Appointment, Service } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { FieldWrap, Input, Select, TextareaLike } from '../components/ui/Field';
import { Stepper } from '../components/ui/Stepper';
import { JalaliCalendar } from '../components/booking/JalaliCalendar';
import { TimeSlots } from '../components/booking/TimeSlots';
import { NotFoundContent } from '../components/NotFoundContent';
import { JDate, addDays, faTime, formatFull, today } from '../lib/jalali';
import { cn, formatPrice, toFa, trackingCode } from '../lib/utils';

const STEPS = ['نوع ویزیت', 'تاریخ', 'ساعت', 'اطلاعات شما', 'تأیید نهایی'];

type FormState = {
  name: string;
  phone: string;
  email: string;
  gender: 'f' | 'm';
  birthYear: string;
  note: string;
};

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const doctor = doctorById(id ?? '');
  const navigate = useNavigate();
  const { user, addAppointment } = useApp();
  usePageTitle(doctor ? `رزرو نوبت — ${doctor.name}` : 'رزرو نوبت');

  const inPersonServices = useMemo(() => doctor?.services.filter((s) => s.type === 'in-person' || s.type === 'follow-up') ?? [], [doctor]);
  const onlineServices = useMemo(() => doctor?.services.filter((s) => s.type === 'online' || s.type === 'special') ?? [], [doctor]);

  const initialService = useMemo(() => {
    const sid = params.get('service');
    if (sid) {
      const s = doctor?.services.find((x) => x.id === sid);
      if (s) return s;
    }
    return inPersonServices[0] ?? onlineServices[0] ?? null;
  }, [doctor, params, inPersonServices, onlineServices]);

  const [step, setStep] = useState(0);
  const [visitType, setVisitType] = useState<'in-person' | 'online'>(
    initialService && (initialService.type === 'online' || initialService.type === 'special') ? 'online' : 'in-person',
  );
  const [service, setService] = useState<Service | null>(initialService);
  const minDate = today();
  const maxDate = addDays(minDate, 45);
  const [date, setDate] = useState<JDate | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    gender: user?.gender ?? 'f',
    birthYear: user ? toFa(String(user.birthYear)) : '',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStep(0);
    setDate(null);
    setTime(null);
    setAccept(false);
  }, [id]);

  if (!doctor || !service) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
        <NotFoundContent title="پزشک مورد نظر پیدا نشد" />
      </div>
    );
  }

  const clinic = clinicById(doctor.clinicId);
  const specialty = specialtyById(doctor.specialtyId);
  const city = cityById(doctor.cityId);
  const typeServices = visitType === 'in-person' ? inPersonServices : onlineServices;

  function selectType(t: 'in-person' | 'online') {
    setVisitType(t);
    const list = t === 'in-person' ? inPersonServices : onlineServices;
    setService(list[0] ?? null);
  }

  function validateForm(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) errs.name = 'لطفاً نام کامل را وارد کنید';
    if (!/^09\d{9}$/.test(form.phone.trim())) errs.phone = 'شماره موبایل معتبر نیست (11 رقم، شروع با 09)';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'ایمیل معتبر نیست';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function canContinue(): boolean {
    switch (step) {
      case 0:
        return !!service;
      case 1:
        return !!date;
      case 2:
        return !!time;
      case 3:
        return true;
      default:
        return true;
    }
  }

  function next() {
    if (step === 3 && !validateForm()) return;
    if (step < 4) setStep(step + 1);
  }

  function back() {
    if (step === 0) {
      navigate(`/doctors/${doctor!.id}`);
      return;
    }
    setStep(step - 1);
  }

  function confirm() {
    if (!accept || !date || !time || !service) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const appt: Appointment = {
        id: `ap-${Date.now()}`,
        code: trackingCode(date.jy, date.jm, date.jd, Date.now()),
        doctorId: doctor!.id,
        serviceName: service.name,
        visitType,
        jy: date.jy,
        jm: date.jm,
        jd: date.jd,
        time,
        price: service.price,
        state: 'pending',
        note: form.note.trim() || undefined,
      };
      addAppointment(appt);
      navigate('/book/success', { state: { appt }, replace: true });
    }, 900);
  }

  const confirmLabel = submitting ? 'در حال ثبت…' : 'تأیید و رزرو نوبت';

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-36 sm:px-6 lg:px-8 lg:py-10 lg:pb-10">
      {/* سربرگ */}
      <div className="mb-6">
        <Link to={`/doctors/${doctor.id}`} className="mb-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink">
          <ChevronRight size={14} />
          بازگشت به پروفایل {doctor.name}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">رزرو نوبت</h1>
          <div className="flex items-center gap-2.5">
            <Avatar name={doctor.name} src={doctor.image} size={36} shape="square" />
            <div className="leading-tight">
              <div className="text-[13px] font-bold text-ink">{doctor.name}</div>
              <div className="text-[11px] text-ink-soft">
                {specialty?.name} · {city?.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-6">
        {/* مرحله ۱: نوع ویزیت */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { t: 'in-person' as const, title: 'ویزیت حضوری', sub: clinic ? `در ${clinic.name}` : 'در کلینیک', Icon: Building2 },
                  { t: 'online' as const, title: 'ویزیت آنلاین', sub: 'ویدئویی از محل خودتان', Icon: Video },
                ]
              ).map(({ t, title, sub, Icon }) => {
                const list = t === 'in-person' ? inPersonServices : onlineServices;
                const available = list.length > 0;
                const active = visitType === t && available;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={!available}
                    onClick={() => selectType(t)}
                    aria-pressed={active}
                    className={cn(
                      'relative rounded-xl border-2 p-4 text-start transition-all',
                      !available && 'cursor-not-allowed opacity-50',
                      active ? 'border-primary-deep bg-primary-faint' : 'border-line bg-white hover:border-primary-soft',
                    )}
                  >
                    {active && (
                      <span className="absolute end-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary-deep text-white">
                        <Check size={12} />
                      </span>
                    )}
                    <span className={cn('grid h-11 w-11 place-items-center rounded-xl', active ? 'bg-white text-primary-deep' : 'bg-primary-light text-primary-deep')}>
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="mt-3 block text-sm font-extrabold text-ink">{title}</span>
                    <span className="mt-1 block text-xs text-ink-soft">{available ? sub : 'این پزشک این نوع ویزیت را ارائه نمی‌دهد'}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <h2 className="mb-3 text-sm font-extrabold text-ink">انتخاب خدمت</h2>
              <div className="space-y-2">
                {typeServices.length === 0 && (
                  <p className="rounded-lg bg-surface p-4 text-[13px] text-ink-soft">خدمتی در این دسته در دسترس نیست.</p>
                )}
                {typeServices.map((s) => {
                  const active = service?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setService(s)}
                      aria-pressed={active}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3.5 text-start transition-all',
                        active ? 'border-primary-deep bg-primary-faint' : 'border-line bg-white hover:border-primary-soft',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
                          active ? 'border-primary-deep' : 'border-line',
                        )}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-primary-deep" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-ink">{s.name}</span>
                          <span className="flex items-center gap-1 text-xs text-ink-soft">
                            <Clock size={12} />
                            {toFa(s.duration)} دقیقه
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-ink-soft">{s.description}</span>
                      </span>
                      <span className="shrink-0 text-[13px] font-extrabold text-ink">{formatPrice(s.price)} <span className="text-[10px] font-medium text-ink-soft">تومان</span></span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* مرحله ۲: تاریخ */}
        {step === 1 && (
          <JalaliCalendar
            value={date}
            onChange={(d) => {
              setDate(d);
              setTime(null);
            }}
            min={minDate}
            max={maxDate}
          />
        )}

        {/* مرحله ۳: ساعت */}
        {step === 2 && date && (
          <TimeSlots
            doctorId={doctor.id}
            date={date}
            value={time}
            onChange={setTime}
          />
        )}

        {/* مرحله ۴: اطلاعات */}
        {step === 3 && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldWrap label="نام و نام خانوادگی" error={errors.name}>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="مثلاً سارا محمدی"
                  invalid={!!errors.name}
                  autoComplete="name"
                />
              </FieldWrap>
              <FieldWrap label="شماره موبایل" error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="0912XXXXXXX"
                  invalid={!!errors.phone}
                  inputMode="numeric"
                  dir="ltr"
                  className="text-end"
                  autoComplete="tel"
                />
              </FieldWrap>
              <FieldWrap label="ایمیل (اختیاری)" error={errors.email} hint="لینک جلسه آنلاین به این ایمیل ارسال می‌شود">
                <Input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  invalid={!!errors.email}
                  inputMode="email"
                  dir="ltr"
                  className="text-end"
                  autoComplete="email"
                />
              </FieldWrap>
              <FieldWrap label="سال تولد (اختیاری)">
                <Select value={form.birthYear} onChange={(e) => setForm((f) => ({ ...f, birthYear: e.target.value }))}>
                  <option value="">انتخاب کنید</option>
                  {Array.from({ length: 41 }, (_, i) => 1385 - i).map((y) => (
                    <option key={y} value={toFa(String(y))}>
                      {toFa(String(y))}
                    </option>
                  ))}
                </Select>
              </FieldWrap>
            </div>

            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">جنسیت</span>
              <div className="flex gap-2">
                {(
                  [
                    { v: 'f', label: 'خانم' },
                    { v: 'm', label: 'آقا' },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={form.gender === o.v}
                    onClick={() => setForm((f) => ({ ...f, gender: o.v }))}
                    className={cn(
                      'h-10 rounded-lg border px-6 text-[13px] font-bold transition-colors',
                      form.gender === o.v ? 'border-primary-deep bg-primary-faint text-primary-deep' : 'border-line bg-white text-ink-soft hover:border-primary-soft',
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <FieldWrap label="یادداشت برای پزشک (اختیاری)">
              <TextareaLike
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="مثلاً سابقه دارویی، نوع درد، یا سؤالی که دارید…"
                rows={3}
              />
            </FieldWrap>

            <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
              <p className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                <ShieldCheck size={13} className="text-success" />
                اطلاعات شما فقط برای انجام ویزیت استفاده می‌شود
              </p>
              <Button type="submit">
                ادامه
                <ChevronLeft size={16} />
              </Button>
            </div>
          </form>
        )}

        {/* مرحله ۵: تأیید */}
        {step === 4 && date && time && (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 rounded-xl border border-line bg-surface p-4">
              <Avatar name={doctor.name} src={doctor.image} size={52} shape="square" />
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold text-ink">{doctor.name}</div>
                <div className="mt-0.5 text-xs text-ink-soft">
                  {specialty?.name} · {city?.name}
                </div>
              </div>
            </div>

            <dl className="divide-y divide-line rounded-xl border border-line">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[13px] text-ink-soft">خدمت</dt>
                <dd className="text-[13px] font-bold text-ink">
                  {service.name} <span className="font-normal text-ink-faint">· {toFa(service.duration)} دقیقه</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[13px] text-ink-soft">نوع ویزیت</dt>
                <dd>
                  <Badge tone={visitType === 'online' ? 'info' : 'neutral'}>
                    {visitType === 'online' ? 'آنلاین (ویدئویی)' : 'حضوری'}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[13px] text-ink-soft">تاریخ</dt>
                <dd className="text-[13px] font-bold text-ink">{formatFull(date)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[13px] text-ink-soft">ساعت</dt>
                <dd className="text-[13px] font-bold text-ink">{faTime(time)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <dt className="shrink-0 text-[13px] text-ink-soft">
                  {visitType === 'online' ? 'لینک جلسه' : 'آدرس'}
                </dt>
                <dd className="text-end text-[13px] leading-6 text-ink">
                  {visitType === 'online'
                    ? 'لینک جلسه به پیامک و ایمیل شما ارسال می‌شود'
                    : doctor.address}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 bg-primary-faint/60 px-4 py-3">
                <dt className="text-[13px] font-bold text-ink">مبلغ قابل پرداخت</dt>
                <dd className="text-[15px] font-black text-primary-deep">{formatPrice(service.price)} تومان</dd>
              </div>
            </dl>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition-colors hover:border-primary-soft">
              <input
                type="checkbox"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#174A6B]"
              />
              <span className="text-[13px] leading-6 text-ink-soft">
                با <b className="text-ink">شرایط استفاده</b> و <b className="text-ink">سیاست لغو نوبت</b> پزشک‌یار موافق‌ام و
                اطلاعات واردشده را تأیید می‌کنم.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* نوار اکشن دسکتاپ */}
      <div className="mt-4 hidden items-center justify-between lg:flex">
        <Button variant="ghost" onClick={back} disabled={submitting}>
          <ChevronRight size={16} />
          {step === 0 ? 'بازگشت به پروفایل' : 'مرحله قبل'}
        </Button>
        {step < 4 ? (
          <Button onClick={next} disabled={!canContinue()}>
            ادامه
            <ChevronLeft size={16} />
          </Button>
        ) : (
          <Button onClick={confirm} disabled={!accept || submitting} size="lg">
            {submitting ? <Loader2 size={17} className="animate-spin" /> : <CalendarCheck size={17} />}
            {confirmLabel}
          </Button>
        )}
      </div>

      {/* نوار چسبان موبایل */}
      <div
        className="fixed inset-x-0 z-30 flex items-center gap-2.5 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur lg:hidden"
        style={{ bottom: 'calc(68px + env(safe-area-inset-bottom))', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <Button variant="ghost" size="sm" onClick={back} disabled={submitting} aria-label="مرحله قبل">
          <ChevronRight size={17} />
        </Button>
        {step < 4 ? (
          <Button className="flex-1" onClick={next} disabled={!canContinue()}>
            ادامه
          </Button>
        ) : (
          <Button className="flex-1" onClick={confirm} disabled={!accept || submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
