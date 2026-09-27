import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';

export function CtaBand() {
  return (
    <section className="mx-auto max-w-container px-4 pb-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary-soft bg-primary-light px-6 py-10 text-center sm:px-10 sm:py-12">
        <h2 className="text-xl font-extrabold text-ink sm:text-2xl">پیدا کردن پزشک، ساده‌تر از همیشه</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-soft">
          همین حالا پزشک مورد نظرتان را پیدا کنید و نوبت را در چند دقیقه رزرو کنید. ثبت‌نام لازم نیست.
        </p>
        <Link to="/doctors" className="mt-6 inline-block">
          <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary-deep px-7 text-[15px] font-bold text-white shadow-card transition-colors hover:bg-[#1e5a80]">
            <CalendarPlus size={17} />
            جستجوی پزشک
          </span>
        </Link>
      </div>
    </section>
  );
}
