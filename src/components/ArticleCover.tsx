import { Apple, Brain, Dumbbell, Droplets, HeartPulse, Moon, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ArticleCoverProps {
  category: string;
  className?: string;
}

const styles: Record<string, { bg: string; fg: string; Icon: LucideIcon }> = {
  general: { bg: '#EDF6FC', fg: '#3178AC', Icon: HeartPulse },
  skin: { bg: '#FDF3F0', fg: '#B0655A', Icon: Droplets },
  nutrition: { bg: '#EEF5EC', fg: '#5C7F4E', Icon: Apple },
  sport: { bg: '#EDF4FA', fg: '#2E6E9E', Icon: Dumbbell },
  sleep: { bg: '#F0F1F8', fg: '#5A6291', Icon: Moon },
  mental: { bg: '#F5EFF7', fg: '#6D5585', Icon: Brain },
};

/** روکاور منسجم مقالات مجله: سیستم تصویرسازی برند بر پایه دسته‌بندی */
export function ArticleCover({ category, className }: ArticleCoverProps) {
  const s = styles[category] ?? styles.general;
  const { Icon } = s;

  return (
    <div
      className={cn('relative grid w-full place-items-center overflow-hidden', className)}
      style={{ backgroundColor: s.bg }}
      aria-hidden
    >
      <span className="absolute h-24 w-24 rounded-full sm:h-28 sm:w-28" style={{ backgroundColor: s.fg, opacity: 0.09 }} />
      <span
        className="absolute h-32 w-32 rounded-full border border-dashed sm:h-40 sm:w-40"
        style={{ borderColor: s.fg, opacity: 0.28 }}
      />
      <Icon size={50} strokeWidth={1.25} style={{ color: s.fg, opacity: 0.75 }} />
      <span className="absolute bottom-5 start-5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.fg, opacity: 0.5 }} />
      <span className="absolute top-5 end-5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.fg, opacity: 0.3 }} />
    </div>
  );
}
