import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Clock, MapPin, Search, Stethoscope } from 'lucide-react';
import { Button } from '../ui/Button';
import { specialties } from '../../data/specialties';
import { cities } from '../../data/cities';
import { formatNumber, toFa } from '../../lib/utils';

function HeroSearchField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-primary-faint/60 lg:py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] font-bold text-ink-faint">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  'w-full cursor-pointer bg-transparent text-sm font-semibold text-ink outline-none disabled:text-ink-faint';

export function Hero() {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [when, setWhen] = useState('');

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set('specialty', specialty);
    if (city) params.set('city', city);
    if (when) params.set('when', when);
    navigate(`/doctors?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-primary-faint/70 to-surface">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:py-20">
          {/* متن + جستجو */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-soft bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
              رزرو نوبت در کمتر از ۲ دقیقه
            </div>

            <h1 className="mt-5 text-balance text-[32px] font-black leading-[1.4] text-ink sm:text-5xl sm:leading-[1.35]">
              پزشک مناسب، <span className="text-primary-deep">همین‌جا</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-8 text-ink-soft sm:text-base">
              پزشک مورد اعتماد خود را پیدا کنید، سوابق و نظرات را بررسی کنید، زمان مناسب را انتخاب کنید و نوبتت را
              آنلاین رزرو کنید.
            </p>

            {/* ماژول جستجو */}
            <form
              onSubmit={search}
              role="search"
              aria-label="جستجوی پزشک"
              className="mt-7 rounded-2xl border border-line bg-white p-2 shadow-card"
            >
              <div className="grid gap-1 sm:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-x-reverse lg:divide-line">
                <HeroSearchField label="تخصص یا نام پزشک" icon={<Stethoscope size={12} />}>
                  <select className={selectClass} value={specialty} onChange={(e) => setSpecialty(e.target.value)} aria-label="تخصص یا نام پزشک">
                    <option value="">همه تخصص‌ها</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </HeroSearchField>

                <HeroSearchField label="شهر" icon={<MapPin size={12} />}>
                  <select className={selectClass} value={city} onChange={(e) => setCity(e.target.value)} aria-label="شهر">
                    <option value="">همه شهرها</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </HeroSearchField>

                <HeroSearchField label="زمان مراجعه" icon={<Clock size={12} />}>
                  <select className={selectClass} value={when} onChange={(e) => setWhen(e.target.value)} aria-label="زمان مراجعه">
                    <option value="">هر زمان</option>
                    <option value="today">امروز</option>
                    <option value="tomorrow">فردا</option>
                    <option value="week">این هفته</option>
                  </select>
                </HeroSearchField>
              </div>
              <div className="mt-2">
                <Button type="submit" block size="lg">
                  <Search size={17} />
                  جستجوی پزشک
                </Button>
              </div>
            </form>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
              {['بدون نیاز به ثبت‌نام', 'تأیید سوابق پزشکان', 'لغوشدن رایگان تا ۲۴ ساعت قبل'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={13} className="text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* تصویر */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-2xl border border-line shadow-card">
              <img
                src="/p-y/images/hero.jpg"
                alt="مذاکره پزشک با بیمار در کلینیکی روشن و مدرن"
                className="aspect-[16/10] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
              />
              {/* پنل اطلاعات روی تصویر */}
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-line bg-white/95 p-3.5 shadow-card backdrop-blur sm:inset-x-auto sm:start-5 sm:bottom-5 sm:w-64 sm:p-4">
                <div className="flex items-stretch">
                  <div className="flex-1">
                    <div className="text-lg font-black text-ink sm:text-xl">{formatNumber(12500)}+</div>
                    <div className="mt-0.5 text-[11px] font-medium text-ink-soft">پزشک تأییدشده</div>
                  </div>
                  <div className="w-px bg-line" aria-hidden />
                  <div className="flex-1 ps-3.5 sm:ps-4">
                    <div className="text-lg font-black text-ink sm:text-xl">{toFa('4.8')}</div>
                    <div className="mt-0.5 text-[11px] font-medium text-ink-soft">میانگین امتیاز</div>
                  </div>
                </div>
              </div>
              {/* چیپ وضعیت */}
              <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-ink shadow-card backdrop-blur sm:end-4 sm:top-4">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
                امروز: {toFa(84)} نوبت در دسترس
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
