import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { SpecialtyIcon } from '../SpecialtyIcon';
import { specialties } from '../../data/specialties';
import { doctorCountBySpecialty } from '../../data/doctors';
import { toFa } from '../../lib/utils';

export function SpecialtiesSection() {
  const top = specialties.slice(0, 8);

  return (
    <section className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="specialties-title">
      <div className="sr-only" id="specialties-title">
        جستجو بر اساس تخصص
      </div>
      <SectionHeader
        title="جستجو بر اساس تخصص"
        description="بیش از ۱۲ رشته تخصصی با پزشکان تأییدشده در سراسر کشور"
        actionTo="/specialties"
        actionLabel="همه تخصص‌ها"
      />

      <div className="grid gap-5 lg:grid-cols-5">
        {/* فهرست شماره‌دار */}
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card lg:col-span-3">
          {top.map((s, i) => (
            <Link
              key={s.id}
              to={`/doctors?specialty=${s.id}`}
              className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-primary-faint/60 sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className="w-7 shrink-0 text-[13px] font-black text-ink-faint">{toFa(String(i + 1).padStart(2, '0'))}</span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-light text-primary-deep transition-colors group-hover:bg-primary-soft">
                <SpecialtyIcon icon={s.icon} size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink">{s.name}</span>
                <span className="mt-0.5 block truncate text-xs text-ink-soft">
                  {toFa(doctorCountBySpecialty(s.id))} پزشک فعال
                </span>
              </span>
              <ArrowLeft size={16} className="shrink-0 text-ink-faint transition-all group-hover:-translate-x-1 group-hover:text-primary-deep" />
            </Link>
          ))}
        </div>

        {/* ستون تصویر + پیشنهاد */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="group relative overflow-hidden rounded-2xl border border-line shadow-card">
            <img
              src="/p-y/images/specialty.jpg"
              alt="گوشه‌ای از کلینیکی مدرن با میز پزشک و استتوسکوپ"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent p-4 pt-10">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                <Sparkles size={14} className="text-primary-soft" />
                پرطرفدارترین تخصص امسال
              </div>
              <div className="mt-0.5 text-xs text-white/85">قلب و عروق</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-primary-soft bg-primary-faint p-5">
            <h3 className="text-sm font-extrabold text-primary-deep">دنبال تخصص خاصی هستید؟</h3>
            <p className="mt-2 text-[13px] leading-6 text-ink-soft">
              برای هر رشته، فهرست کامل پزشکان را با فیلتر قیمت، امتیاز، شهر و امکان ویزیت آنلاین آماده کرده‌ایم.
            </p>
            <Link
              to="/specialties"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep transition-colors hover:text-[#123c56]"
            >
              مشاهده همه تخصص‌ها
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
