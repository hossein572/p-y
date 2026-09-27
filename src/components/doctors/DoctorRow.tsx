import { Link } from 'react-router-dom';
import { Briefcase, CalendarPlus, MapPin } from 'lucide-react';
import type { Doctor } from '../../types';
import { specialtyById } from '../../data/specialties';
import { cityById } from '../../data/cities';
import { Avatar } from '../ui/Avatar';
import { RatingRow } from '../ui/Rating';
import { Button } from '../ui/Button';
import { VerifiedBadge } from './VerifiedBadge';
import { FavoriteButton } from './FavoriteButton';
import { formatPrice, toFa } from '../../lib/utils';

/** ردیف افقی پزشک برای نتایج جستجو */
export function DoctorRow({ doctor }: { doctor: Doctor }) {
  const specialty = specialtyById(doctor.specialtyId);
  const city = cityById(doctor.cityId);

  return (
    <article className="rounded-2xl border border-line bg-white p-3 shadow-card transition-all duration-200 hover:border-primary-soft hover:shadow-card-hover sm:p-4">
      <div className="flex gap-3.5 sm:gap-4">
        <Link to={`/doctors/${doctor.id}`} className="relative block shrink-0 self-start" aria-label={`پروفایل ${doctor.name}`}>
          <Avatar
            name={doctor.name}
            src={doctor.image}
            shape="square"
            size={104}
            className="h-[104px] w-[104px] rounded-xl"
          />
          {doctor.verified && (
            <span className="absolute start-1.5 top-1.5">
              <VerifiedBadge onImage className="!whitespace-nowrap" />
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-ink">
                <Link to={`/doctors/${doctor.id}`} className="transition-colors hover:text-primary-deep">
                  {doctor.name}
                </Link>
              </h3>
              <p className="mt-0.5 truncate text-[13px] text-ink-soft">{specialty?.name}</p>
            </div>
            <FavoriteButton doctorId={doctor.id} name={doctor.name} className="shrink-0" />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <RatingRow value={doctor.rating} count={doctor.reviewCount} />
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
              <Briefcase size={12} className="text-ink-faint" />
              {toFa(doctor.experience)} سال سابقه
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
              <MapPin size={12} className="text-ink-faint" />
              {city?.name}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="min-w-0">
              <div className="text-sm">
                <span className="font-extrabold text-ink">{formatPrice(doctor.priceFrom)}</span>
                <span className="ms-1 text-xs text-ink-soft">تومان / ویزیت</span>
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-success">
                آزاد: {doctor.nextFree.label} {doctor.nextFree.time}
              </div>
            </div>
            <Link to={`/book/${doctor.id}`} className="shrink-0">
              <Button size="sm">
                <CalendarPlus size={15} />
                دریافت نوبت
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
