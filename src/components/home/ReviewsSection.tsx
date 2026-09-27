import { Quote } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Avatar } from '../ui/Avatar';
import { Stars } from '../ui/Rating';
import { reviews } from '../../data/reviews';
import { doctors, doctorById } from '../../data/doctors';
import { formatNumber } from '../../lib/utils';

export function ReviewsSection() {
  const total = doctors.reduce((sum, d) => sum + d.reviewCount, 0);
  const avg = doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length;
  const shown = reviews.slice(0, 3);

  return (
    <section className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="reviews-title">
      <div className="sr-only" id="reviews-title">
        نظرات بیماران
      </div>
      <SectionHeader
        title="نظرات بیماران"
        description="بازخورد واقعی افرادی که ویزیت خود را از طریق پزشک‌یار انجام داده‌اند"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* خلاصه امتیاز */}
        <div className="flex flex-col justify-center rounded-2xl border border-primary-soft bg-primary-faint p-6">
          <div className="text-5xl font-black tracking-tight text-primary-deep">{avg.toFixed(1).replace('.', '٫')}</div>
          <div className="mt-2">
            <Stars value={Math.round(avg)} size={16} />
          </div>
          <p className="mt-3 text-[13px] leading-6 text-ink-soft">
            میانگین امتیاز {formatNumber(total)}+ نظر واقعی بیماران
          </p>
        </div>

        {shown.map((r) => {
          const d = doctorById(r.doctorId);
          return (
            <figure key={r.id} className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
              <Quote size={18} className="text-primary-soft" aria-hidden />
              <blockquote className="mt-3 flex-1 text-[13px] leading-7 text-ink-soft">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <Avatar name={r.author} size={38} />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-ink">{r.author}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-faint">
                    <Stars value={r.rating} size={11} />
                    <span className="truncate">{d?.name}</span>
                  </div>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
