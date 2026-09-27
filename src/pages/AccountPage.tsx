import React, {useMemo, useState} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CalendarX2,
  Check,
  ChevronLeft,
  Clock,
  Heart,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { doctorById } from '../data/doctors';
import { specialtyById } from '../data/specialties';
import type { Appointment } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { FieldWrap, Input, Select, TextareaLike } from '../components/ui/Field';
import { FavoriteButton } from '../components/doctors/FavoriteButton';
import { faTime, formatShort, today } from '../lib/jalali';
import { cn, formatPrice, toFa } from '../lib/utils';

type TabId = 'appointments' | 'past' | 'favorites' | 'profile' | 'addresses' | 'notifications';

const tabs: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'appointments', label: 'نوبت‌های آینده', Icon: CalendarDays },
  { id: 'past', label: 'نوبت‌های قبلی', Icon: Clock },
  { id: 'favorites', label: 'علاقه‌مندی‌ها', Icon: Heart },
  { id: 'profile', label: 'اطلاعات شخصی', Icon: UserRound },
  { id: 'addresses', label: 'آدرس‌ها', Icon: MapPin },
  { id: 'notifications', label: 'اعلان‌ها', Icon: Bell },
];

const stateBadge: Record<Appointment['state'], { tone: 'success' | 'warn' | 'danger' | 'neutral'; label: string }> = {
  confirmed: { tone: 'success', label: 'تأیید شده' },
  pending: { tone: 'warn', label: 'در انتظار تأیید' },
  cancelled: { tone: 'danger', label: 'لغو شده' },
  done: { tone: 'neutral', label: 'انجام شده' },
};

function AppointmentCard({ appt, canCancel }: { appt: Appointment; canCancel: boolean }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { cancelAppointment } = useApp();
  const d = doctorById(appt.doctorId);
  if (!d) return null;
  const badge = stateBadge[appt.state];
  const dateObj = { jy: appt.jy, jm: appt.jm, jd: appt.jd };

  return (
    <article className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={`/doctors/${d.id}`} className="shrink-0" aria-label={`پروفایل ${d.name}`}>
            <Avatar name={d.name} src={d.image} size={48} shape="square" />
          </Link>
          <div className="min-w-0">
            <Link to={`/doctors/${d.id}`} className="block truncate text-sm font-extrabold text-ink transition-colors hover:text-primary-deep">
              {d.name}
            </Link>
            <div className="mt-0.5 truncate text-xs text-ink-soft">
              {specialtyById(d.specialtyId)?.name} · {appt.serviceName}
            </div>
          </div>
        </div>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
        <div className="rounded-lg bg-surface px-3 py-2">
          <div className="text-[11px] text-ink-faint">تاریخ</div>
          <div className="mt-0.5 font-bold text-ink">{formatShort(dateObj)}</div>
        </div>
        <div className="rounded-lg bg-surface px-3 py-2">
          <div className="text-[11px] text-ink-faint">ساعت</div>
          <div className="mt-0.5 font-bold text-ink">{faTime(appt.time)}</div>
        </div>
        <div className="rounded-lg bg-surface px-3 py-2">
          <div className="text-[11px] text-ink-faint">نوع ویزیت</div>
          <div className="mt-0.5 flex items-center gap-1 font-bold text-ink">
            {appt.visitType === 'online' ? <Video size={13} /> : <MapPin size={13} />}
            {appt.visitType === 'online' ? 'آنلاین' : 'حضوری'}
          </div>
        </div>
        <div className="rounded-lg bg-surface px-3 py-2">
          <div className="text-[11px] text-ink-faint">کد پیگیری</div>
          <div className="mt-0.5 truncate font-bold tracking-wide text-ink">{appt.code}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3.5">
        <span className="text-[13px] text-ink-soft">
          مبلغ: <b className="text-ink">{formatPrice(appt.price)} تومان</b>
        </span>
        <div className="flex gap-2">
          {canCancel && (
            <Button variant="ghost" size="sm" className="!text-danger hover:!bg-danger-soft" onClick={() => setConfirmOpen(true)}>
              <CalendarX2 size={14} />
              لغو نوبت
            </Button>
          )}
          <Link to={`/doctors/${d.id}`}>
            <Button variant="outline" size="sm">
              مشاهده پزشک
            </Button>
          </Link>
        </div>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="لغو نوبت">
        <div className="p-5">
          <p className="text-sm leading-7 text-ink-soft">
            آیا از لغو نوبت <b className="text-ink">{d.name}</b> برای {formatShort(dateObj)} ساعت {faTime(appt.time)} مطمئن
            هستید؟ لغوشدن تا ۲۴ ساعت قبل رایگان است.
          </p>
          <div className="mt-5 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setConfirmOpen(false)}>
              نه، نوبت را نگه دار
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                cancelAppointment(appt.id);
                setConfirmOpen(false);
              }}
            >
              بله، لغو کن
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
}

export function AccountPage() {
  usePageTitle('حساب من');
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const tab: TabId = tabs.some((t) => t.id === tabParam) ? (tabParam as TabId) : 'appointments';

  const { user, logout, appointments, favorites, notifications, addresses, addAddress, removeAddress, toast } = useApp();

  const t = today();
  const isPast = (a: Appointment) => a.jy < t.jy || (a.jy === t.jy && (a.jm < t.jm || (a.jm === t.jm && a.jd <= t.jd)));
  const upcoming = useMemo(
    () => appointments.filter((a) => (a.state === 'confirmed' || a.state === 'pending') && !isPast(a)),
    [appointments],
  );
  const past = useMemo(
    () => appointments.filter((a) => a.state === 'done' || a.state === 'cancelled' || isPast(a)),
    [appointments],
  );
  const favDocs = favorites.map((id) => doctorById(id)).filter(Boolean);

  // فرم اطلاعات شخصی
  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    birthYear: user ? toFa(String(user.birthYear)) : '',
  });
  const [profileErrors, setProfileErrors] = useState<{ name?: string; phone?: string }>({});

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const errs: { name?: string; phone?: string } = {};
    if (profile.name.trim().length < 3) errs.name = 'نام کامل را وارد کنید';
    if (!/^09\d{9}$/.test(profile.phone.trim())) errs.phone = 'شماره موبایل معتبر نیست';
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;
    toast('اطلاعات شما با موفقیت ذخیره شد');
  }

  // فرم آدرس جدید
  const [addrOpen, setAddrOpen] = useState(false);
  const [addr, setAddr] = useState({ label: 'خانه', detail: '', city: 'تهران' });
  const [addrError, setAddrError] = useState('');

  function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (addr.detail.trim().length < 6) {
      setAddrError('آدرس را کامل‌تر بنویسید');
      return;
    }
    addAddress({ id: `a-${Date.now()}`, label: addr.label, detail: addr.detail.trim(), city: addr.city, primary: false });
    setAddrOpen(false);
    setAddr({ label: 'خانه', detail: '', city: 'تهران' });
    setAddrError('');
  }

  const navItems = (
    <div className="flex flex-col gap-1">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setParams({ tab: id }, { replace: true })}
          aria-current={tab === id ? 'page' : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors',
            tab === id ? 'bg-primary-light text-primary-deep' : 'text-ink-soft hover:bg-primary-faint hover:text-ink',
          )}
        >
          <Icon size={16} strokeWidth={tab === id ? 2 : 1.7} />
          {label}
          {id === 'appointments' && upcoming.length > 0 && (
            <span className="ms-auto grid h-5 min-w-[20px] place-items-center rounded-full bg-primary-deep px-1.5 text-[10px] font-bold text-white">
              {toFa(upcoming.length)}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-5 text-xl font-extrabold text-ink sm:text-2xl">حساب من</h1>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* سایدبار */}
        <aside>
          <div className="lg:sticky lg:top-24">
            {user ? (
              <div className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size={48} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-ink">{user.name}</div>
                    <div className="mt-0.5 text-xs text-ink-soft" dir="ltr">
                      {user.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:border-danger hover:bg-danger-soft hover:text-danger"
                >
                  <LogOut size={14} />
                  خروج از حساب
                </button>
              </div>
            ) : (
              <div className="mb-4 rounded-2xl border border-dashed border-primary-soft bg-primary-faint p-4 text-center">
                <p className="text-[13px] leading-6 text-ink-soft">
                  برای مشاهده اطلاعات شخصی، وارد حساب شوید.
                </p>
                <p className="mt-2 text-[11px] text-ink-faint">از دکمه «ورود / ثبت‌نام» در بالای صفحه استفاده کنید</p>
              </div>
            )}
            {/* ناوبری دسکتاپ */}
            <nav className="hidden rounded-2xl border border-line bg-white p-3 shadow-card lg:block" aria-label="بخش‌های حساب">
              {navItems}
            </nav>
          </div>
        </aside>

        {/* ناوبری موبایل */}
        <nav className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden" aria-label="بخش‌های حساب">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setParams({ tab: id }, { replace: true })}
              aria-current={tab === id ? 'page' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-bold transition-colors',
                tab === id ? 'border-primary-deep bg-primary-deep text-white' : 'border-line bg-white text-ink-soft',
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </nav>

        {/* محتوا */}
        <div className="min-w-0">
          {tab === 'appointments' &&
            (upcoming.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white shadow-card">
                <EmptyState
                  icon={<CalendarDays size={26} />}
                  title="نوبت آینده‌ای ندارید"
                  description="همین حالا پزشک مورد نظرتان را پیدا کنید و اولین نوبتتان را رزرو کنید."
                  action={
                    <Link to="/doctors">
                      <Button>جستجوی پزشک</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appt={a} canCancel />
                ))}
              </div>
            ))}

          {tab === 'past' &&
            (past.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white shadow-card">
                <EmptyState icon={<Clock size={26} />} title="نوبت قبلی ندارید" />
              </div>
            ) : (
              <div className="space-y-4">
                {past.map((a) => (
                  <AppointmentCard key={a.id} appt={a} canCancel={false} />
                ))}
              </div>
            ))}

          {tab === 'favorites' &&
            (favDocs.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white shadow-card">
                <EmptyState
                  icon={<Heart size={26} />}
                  title="هنوز پزشکی به لیست علاقه‌مندی‌های شما اضافه نشده است"
                  action={
                    <Link to="/doctors">
                      <Button>جستجوی پزشک</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {favDocs.map(
                  (d) =>
                    d && (
                      <div
                        key={d.id}
                        className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-card sm:p-4"
                      >
                        <Link to={`/doctors/${d.id}`} className="shrink-0" aria-label={`پروفایل ${d.name}`}>
                          <Avatar name={d.name} src={d.image} size={52} shape="square" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link to={`/doctors/${d.id}`} className="block truncate text-sm font-bold text-ink transition-colors hover:text-primary-deep">
                            {d.name}
                          </Link>
                          <div className="mt-0.5 text-xs text-ink-soft">{specialtyById(d.specialtyId)?.name}</div>
                        </div>
                        <div className="hidden text-[13px] font-extrabold text-ink sm:block">{formatPrice(d.priceFrom)} <span className="text-[10px] font-medium text-ink-soft">تومان</span></div>
                        <FavoriteButton doctorId={d.id} name={d.name} />
                        <Link to={`/book/${d.id}`} className="shrink-0">
                          <Button size="sm">نوبت</Button>
                        </Link>
                      </div>
                    ),
                )}
              </div>
            ))}

          {tab === 'profile' &&
            (!user ? (
              <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card">
                <UserRound size={26} className="mx-auto text-ink-faint" />
                <p className="mt-3 text-sm font-bold text-ink">برای ویرایش اطلاعات، وارد حساب شوید</p>
              </div>
            ) : (
              <form onSubmit={saveProfile} noValidate className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
                <h2 className="text-base font-extrabold text-ink">اطلاعات شخصی</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FieldWrap label="نام و نام خانوادگی" error={profileErrors.name}>
                    <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} invalid={!!profileErrors.name} />
                  </FieldWrap>
                  <FieldWrap label="شماره موبایل" error={profileErrors.phone}>
                    <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} invalid={!!profileErrors.phone} dir="ltr" className="text-end" inputMode="numeric" />
                  </FieldWrap>
                  <FieldWrap label="ایمیل">
                    <Input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} dir="ltr" className="text-end" placeholder="you@example.com" />
                  </FieldWrap>
                  <FieldWrap label="سال تولد">
                    <Select value={profile.birthYear} onChange={(e) => setProfile((p) => ({ ...p, birthYear: e.target.value }))}>
                      <option value="">انتخاب کنید</option>
                      {Array.from({ length: 41 }, (_, i) => 1385 - i).map((y) => (
                        <option key={y} value={toFa(String(y))}>
                          {toFa(String(y))}
                        </option>
                      ))}
                    </Select>
                  </FieldWrap>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    <Check size={16} />
                    ذخیره تغییرات
                  </Button>
                </div>
              </form>
            ))}

          {tab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-ink">آدرس‌های من</h2>
                <Button size="sm" onClick={() => setAddrOpen(true)}>
                  <Plus size={15} />
                  افزودن آدرس
                </Button>
              </div>
              {addresses.length === 0 ? (
                <div className="rounded-2xl border border-line bg-white shadow-card">
                  <EmptyState icon={<MapPin size={26} />} title="آدرسی ثبت نکرده‌اید" description="آدرس منزل یا محل کار را اضافه کنید تا در ویزیت حضوری راحت‌تر راهنمایی شوید." />
                </div>
              ) : (
                addresses.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary-deep">
                      <MapPin size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-ink">{a.label}</span>
                        {a.primary && <Badge tone="success">اصلی</Badge>}
                        <span className="text-xs text-ink-faint">{a.city}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-6 text-ink-soft">{a.detail}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button aria-label="ویرایش آدرس" className="grid h-9 w-9 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-primary-faint hover:text-ink">
                        <Pencil size={15} />
                      </button>
                      <button aria-label="حذف آدرس" onClick={() => removeAddress(a.id)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-ink">اعلان‌های اخیر</h2>
                <Link to="/notifications" className="flex items-center gap-1 text-[13px] font-bold text-primary-deep hover:underline">
                  مشاهده همه
                  <ChevronLeft size={14} />
                </Link>
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                <ul className="divide-y divide-line">
                  {notifications.slice(0, 4).map((n) => (
                    <li key={n.id} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                      <span className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-line' : 'bg-danger')} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-ink">{n.title}</div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{n.body}</div>
                      </div>
                      <span className="shrink-0 text-[11px] text-ink-faint">{n.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مودال آدرس جدید */}
      <Modal open={addrOpen} onClose={() => setAddrOpen(false)} title="افزودن آدرس جدید">
        <form onSubmit={saveAddress} noValidate className="flex flex-col gap-4 p-5">
          <FieldWrap label="برچسب آدرس">
            <Select value={addr.label} onChange={(e) => setAddr((a) => ({ ...a, label: e.target.value }))}>
              <option value="خانه">خانه</option>
              <option value="محل کار">محل کار</option>
              <option value="سایر">سایر</option>
            </Select>
          </FieldWrap>
          <FieldWrap label="شهر">
            <Select value={addr.city} onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))}>
              {['تهران', 'اصفهان', 'شیراز', 'تبریز', 'مشهد', 'کرمان', 'قم', 'رشت'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FieldWrap>
          <FieldWrap label="جزئیات آدرس" error={addrError}>
            <TextareaLike
              value={addr.detail}
              onChange={(e) => setAddr((a) => ({ ...a, detail: e.target.value }))}
              placeholder="خیابان، کوچه، پلاک، واحد…"
              rows={2}
              invalid={!!addrError}
            />
          </FieldWrap>
          <Button type="submit" block>
            ذخیره آدرس
          </Button>
        </form>
      </Modal>
    </div>
  );
}
