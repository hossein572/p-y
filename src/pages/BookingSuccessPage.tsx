import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarCheck,
  Check,
  Clock,
  Copy,
  Home,
  Info,
  MapPin,
  Ticket,
  Video,
} from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { doctorById } from '../data/doctors';
import { specialtyById } from '../data/specialties';
import { clinicById } from '../data/clinics';
import type { Appointment } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { JDate, faTime, formatFull } from '../lib/jalali';
import { cn, formatPrice, toFa } from '../lib/utils';

export function BookingSuccessPage() {
  usePageTitle('نوبت شما ثبت شد');
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const appt = (location.state as { appt?: Appointment } | null)?.appt;
  const doctor = appt ? doctorById(appt.doctorId) : undefined;
  const specialty = doctor ? specialtyById(doctor.specialtyId) : undefined;
  const clinic = doctor ? clinicById(doctor.clinicId) : undefined;
  const date: JDate | null = appt ? { jy: appt.jy, jm: appt.jm, jd: appt.jd } : null;

  function copyCode() {
    if (!appt) return;
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(appt.code).then(done).catch(done);
    } else {
      const ta = document.createElement('textarea');
      ta.value = appt.code;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      ta.remove();
      done();
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {!appt || !doctor || !date ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-card">
          <Info size={28} className="mx-auto text-ink-faint" />
          <h1 className="mt-4 text-lg font-extrabold text-ink">جزئیات نوبتی یافت نشد</h1>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            به‌نظر می‌رسد شما مستقیماً وارد این صفحه شده‌اید. نوبت‌های ثبت‌شده‌تان را از بخش «نوبت‌ها» در حساب کاربری
            ببینید.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/account?tab=appointments">
              <Button>مشاهده نوبت‌های من</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">بازگشت به خانه</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* وضعیت موفقیت */}
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft">
              <CalendarCheck size={30} className="text-success" strokeWidth={2} />
            </div>
            <h1 className="mt-5 text-xl font-extrabold text-ink sm:text-2xl">نوبت شما با موفقیت ثبت شد</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-soft">
              جزئیات نوبت برای شما پیامک شد. کد پیگیری خود را ذخیره کنید و وضعیت نوبت را از بخش «نوبت‌ها» پیگیری
              کنید.
            </p>
          </div>

          {/* بلیت نوبت */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-line bg-primary-faint/60 p-5">
              <div className="flex items-center gap-3">
                <Avatar name={doctor.name} src={doctor.image} size={48} shape="square" />
                <div>
                  <div className="text-sm font-extrabold text-ink">{doctor.name}</div>
                  <div className="mt-0.5 text-xs text-ink-soft">{specialty?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-primary-soft bg-white px-3 py-1.5 text-xs font-black tracking-wide text-primary-deep" dir="ltr">
                  <Ticket size={13} />
                  {appt.code}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label={copied ? 'کپی شد' : 'کپی کد پیگیری'}
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-lg border transition-colors',
                    copied
                      ? 'border-success-soft bg-success-soft text-success'
                      : 'border-line bg-white text-ink-soft hover:border-primary hover:text-primary-deep',
                  )}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <dl className="divide-y divide-line">
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <dt className="flex items-center gap-2 text-[13px] text-ink-soft">
                  <Info size={14} className="text-primary-700" />
                  خدمت
                </dt>
                <dd className="text-[13px] font-bold text-ink">{appt.serviceName}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <dt className="flex items-center gap-2 text-[13px] text-ink-soft">
                  {appt.visitType === 'online' ? <Video size={14} className="text-primary-700" /> : <MapPin size={14} className="text-primary-700" />}
                  نوع ویزیت
                </dt>
                <dd>
                  <Badge tone={appt.visitType === 'online' ? 'info' : 'neutral'}>
                    {appt.visitType === 'online' ? 'آنلاین (ویدئویی)' : 'حضوری'}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <dt className="flex items-center gap-2 text-[13px] text-ink-soft">
                  <Clock size={14} className="text-primary-700" />
                  تاریخ و ساعت
                </dt>
                <dd className="text-[13px] font-bold text-ink">
                  {formatFull(date)} · {faTime(appt.time)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 px-5 py-3.5">
                <dt className="shrink-0 text-[13px] text-ink-soft">
                  {appt.visitType === 'online' ? 'لینک جلسه' : 'آدرس'}
                </dt>
                <dd className="text-end text-[13px] leading-6 text-ink">
                  {appt.visitType === 'online'
                    ? 'لینک جلسه به پیامک و ایمیل شما ارسال شد'
                    : doctor.address}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 bg-surface px-5 py-3.5">
                <dt className="text-[13px] font-bold text-ink">مبلغ</dt>
                <dd className="text-[15px] font-black text-primary-deep">{formatPrice(appt.price)} تومان</dd>
              </div>
            </dl>
          </div>

          {/* وضعیت */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-warn-soft bg-warn-soft/60 p-4">
            <Info size={17} className="mt-0.5 shrink-0 text-warn" />
            <p className="text-[13px] leading-6 text-ink-soft">
              نوبت شما در وضعیت <b className="text-ink">«در انتظار تأیید»</b> است. تیم کلینیک تا ۲ ساعت آینده نوبت
              شما را تأیید می‌کند و نتیجه را پیامک می‌کنیم.
              {clinic && (
                <>
                  {' '}
                  در صورت نیاز، با {clinic.name} ({clinic.phone}) در ارتباط باشید.
                </>
              )}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/account?tab=appointments" className="flex-1 sm:flex-none">
              <Button block size="lg">
                مشاهده نوبت
              </Button>
            </Link>
            <Link to="/" className="flex-1 sm:flex-none">
              <Button variant="outline" block size="lg">
                <Home size={16} />
                بازگشت به خانه
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-faint">
            وضعیت نوبت شما: <Badge tone="warn">در انتظار تأیید</Badge> · {toFa(24)} ساعت قبل امکان لغو رایگان
          </p>
        </>
      )}
    </div>
  );
}
