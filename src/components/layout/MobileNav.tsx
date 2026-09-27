import { NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, Heart, Home, Search, UserRound } from 'lucide-react';
import { cn, toFa } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

const items = [
  { to: '/', label: 'خانه', icon: Home, end: true },
  { to: '/doctors', label: 'جستجو', icon: Search },
  { to: '/account?tab=appointments', label: 'نوبت‌ها', icon: CalendarDays },
  { to: '/favorites', label: 'علاقه‌مندی', icon: Heart },
  { to: '/account?tab=profile', label: 'پروفایل', icon: UserRound },
];

/** ناوبری پایین موبایل */
export function MobileNav() {
  const location = useLocation();
  const { appointments } = useApp();
  const upcomingCount = appointments.filter((a) => a.state === 'confirmed' || a.state === 'pending').length;

  return (
    <nav
      aria-label="ناوبری پایین"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => {
          const isHome = to === '/';
          const baseTo = to.split('?')[0];
          return (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) => {
                // برای آیتم‌هایی با query، استیو فعال را از مسیر اصلی بگیر
                const active = to.includes('?') ? baseTo === location.pathname && !isHome : isActive;
                return cn('relative flex flex-col items-center gap-1 py-2.5 transition-colors', active ? 'text-primary-deep' : 'text-ink-faint');
              }}
            >
              {({ isActive }) => {
                const isHomeActive = isHome && isActive;
                const otherActive = to.includes('?') && baseTo === location.pathname;
                const active = isHomeActive || otherActive;
                return (
                  <>
                    <span
                      className={cn(
                        'grid h-7 w-12 place-items-center rounded-full transition-colors',
                        active ? 'bg-primary-light' : 'bg-transparent',
                      )}
                    >
                      <Icon size={19} strokeWidth={active ? 2 : 1.7} />
                      {label === 'نوبت‌ها' && upcomingCount > 0 && (
                        <span className="absolute -top-0.5 start-[calc(50%+14px)] grid h-4 min-w-[16px] place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                          {toFa(upcomingCount)}
                        </span>
                      )}
                    </span>
                    <span className={cn('text-[10px]', active ? 'font-bold' : 'font-medium')}>{label}</span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
