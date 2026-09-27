import { Link } from 'react-router-dom';
import { Briefcase, MapPin } from 'lucide-react';
import type { Doctor } from '../../types';
import { specialtyById } from '../../data/specialties';
import { cityById } from '../../data/cities';
import { Avatar } from '../ui/Avatar';
import { RatingRow } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { VerifiedBadge } from './VerifiedBadge';
import { FavoriteButton } from './FavoriteButton';
import { formatPrice, toFa } from '../../lib/utils';

/** کارت پزشک برای گرید (خانه، علاقه‌مندی‌ها) */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const specialty = specialtyById(doctor.specialtyId);
  const city = cityById(doctor.cityId);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-card-hover">
      <div className="relative overflow-hidden rounded-xl bg-primary-faint">
        <Avatar
          name={doctor.name}
          src={doctor.image}
          shape="square"
          fluid
          className="aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {doctor.verified && (
          <span className="absolute start-2.5 top-2.5">
            <VerifiedBadge onImage />
          </span>
        )}
        <span className="absolute end-2.5 top-2.5">
          <FavoriteButton doctorId={doctor.id} name={doctor.name} onImage />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2.5 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-[15px] font-bold text-ink">
            <Link to={`/doctors/${doctor.id}`} className="transition-colors hover:text-primary-deep">
              {doctor.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-primary-700">{specialty?.name}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingRow value={doctor.rating} count={doctor.reviewCount} />
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-ink-faint" />
            {city?.name}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase size={12} className="text-ink-faint" />
            {toFa(doctor.experience)} سال سابقه
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-line pt-3">
          <div>
            <span className="text-[15px] font-extrabold text-ink">{formatPrice(doctor.priceFrom)}</span>
            <span className="ms-1 text-[11px] text-ink-soft">تومان</span>
          </div>
          <Badge tone="success">
            {doctor.nextFree.label} {doctor.nextFree.time}
          </Badge>
        </div>

        <Link to={`/doctors/${doctor.id}`} className="mt-3">
          <Button variant="outline" size="sm" block>
            مشاهده پروفایل
          </Button>
        </Link>
      </div>
    </article>
  );
}
