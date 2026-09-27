import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, CalendarPlus, Layers, Video } from 'lucide-react';

const actions = [
  { to: '/doctors', title: 'نوبت پزشک', sub: 'پیدا کن و رزرو کن', Icon: CalendarPlus },
  { to: '/specialties', title: 'مشاهده تخصص‌ها', sub: '۱۲ رشته تخصصی', Icon: Layers },
  { to: '/clinics', title: 'کلینیک‌ها', sub: '۱۰ کلینیک معتبر', Icon: Building2 },
  { to: '/doctors?online=1', title: 'مشاوره آنلاین', sub: 'ویدئویی از خانه', Icon: Video },
];

export function QuickActions() {
  return (
    <section className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="mb-4 text-base font-extrabold text-ink">
        سریع به چیزی که نیاز داری برس
      </h2>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card lg:grid-cols-4">
        {actions.map(({ to, title, sub, Icon }) => (
          <Link
            key={title}
            to={to}
            className="group flex items-center gap-3 bg-white p-4 transition-colors hover:bg-primary-faint/60 sm:gap-3.5 lg:p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary-deep transition-colors group-hover:bg-primary-soft sm:h-11 sm:w-11">
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-bold text-ink sm:text-sm">{title}</span>
              <span className="mt-0.5 block truncate text-[11px] text-ink-soft sm:text-xs">{sub}</span>
            </span>
            <ArrowLeft
              size={15}
              className="ms-auto shrink-0 text-ink-faint transition-all group-hover:-translate-x-0.5 group-hover:text-primary-deep"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
