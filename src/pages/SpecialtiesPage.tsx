import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { specialties } from '../data/specialties';
import { doctorCountBySpecialty } from '../data/doctors';
import { SpecialtyIcon } from '../components/SpecialtyIcon';
import { toFa } from '../lib/utils';

export function SpecialtiesPage() {
  usePageTitle('تخصص‌ها');

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">جستجو بر اساس تخصص</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {toFa(specialties.length)} رشته تخصصی با پزشکان تأییدشده در سراسر کشور
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specialties.map((s, i) => (
          <Link
            key={s.id}
            to={`/doctors?specialty=${s.id}`}
            className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-primary-deep transition-colors group-hover:bg-primary-soft">
                <SpecialtyIcon icon={s.icon} size={22} />
              </span>
              <span className="text-[13px] font-black text-ink-faint">{toFa(String(i + 1).padStart(2, '0'))}</span>
            </div>
            <h2 className="mt-4 text-[15px] font-extrabold text-ink transition-colors group-hover:text-primary-deep">
              {s.name}
            </h2>
            <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{s.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
              <span className="text-xs font-semibold text-ink-soft">{toFa(doctorCountBySpecialty(s.id))} پزشک فعال</span>
              <span className="flex items-center gap-1 text-[13px] font-bold text-primary-deep">
                مشاهده پزشکان
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
