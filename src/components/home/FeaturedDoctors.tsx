import { SectionHeader } from '../ui/SectionHeader';
import { DoctorCard } from '../doctors/DoctorCard';
import { doctors } from '../../data/doctors';

export function FeaturedDoctors() {
  const featured = [...doctors].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <section className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="featured-title">
      <div className="sr-only" id="featured-title">
        پزشکان منتخب
      </div>
      <SectionHeader
        title="پزشکان منتخب"
        description="پزشکانی با بالاترین امتیاز بیماران در ماه گذشته"
        actionTo="/doctors"
        actionLabel="مشاهده همه پزشکان"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>
    </section>
  );
}
