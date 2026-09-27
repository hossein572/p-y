import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

interface FavoriteButtonProps {
  doctorId: string;
  name: string;
  onImage?: boolean;
  className?: string;
}

/** دکمه علاقه‌مندی با وضعیت انتخاب‌شده */
export function FavoriteButton({ doctorId, name, onImage, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(doctorId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(doctorId);
      }}
      aria-label={active ? `حذف ${name} از علاقه‌مندی‌ها` : `افزودن ${name} به علاقه‌مندی‌ها`}
      aria-pressed={active}
      className={cn(
        'grid place-items-center rounded-full transition-all duration-150',
        onImage
          ? 'h-8 w-8 bg-white/90 shadow-card backdrop-blur hover:scale-105'
          : 'h-10 w-10 border border-line bg-white hover:border-primary',
        active ? 'text-danger' : 'text-ink-faint hover:text-ink-soft',
        className,
      )}
    >
      <Heart size={onImage ? 15 : 17} className={active ? 'fill-danger' : ''} />
    </button>
  );
}
