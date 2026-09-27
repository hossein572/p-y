import {useEffect, useState} from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bell, CalendarPlus, Menu, UserRound, X } from 'lucide-react';
import { Wordmark } from './LogoMark';
import { Button } from '../ui/Button';
import { LoginModal } from './LoginModal';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/doctors', label: 'پزشکان' },
  { to: '/specialties', label: 'تخصص‌ها' },
  { to: '/clinics', label: 'کلینیک‌ها' },
  { to: '/magazine', label: 'مجله پزشکی' },
  { to: '/about', label: 'درباره ما' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, unreadCount } = useApp();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow',
          scrolled ? 'border-line shadow-card' : 'border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <Link to="/" aria-label="پزشک‌یار، صفحه اصلی" className="shrink-0">
            <Wordmark />
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary-faint font-semibold text-ink' : 'text-ink-soft hover:bg-primary-faint/70 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              aria-label={`اعلان‌ها${unreadCount > 0 ? `، ${unreadCount} نخوانده` : ''}`}
              className="relative grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-primary-faint hover:text-ink"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute end-1.5 top-1.5 grid min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white" style={{ height: 18 }}>
                  {unreadCount > 9 ? '۹+' : unreadCount.toLocaleString('fa-IR')}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/account"
                className="hidden h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-ink transition-colors hover:border-primary md:inline-flex"
              >
                <UserRound size={16} className="text-primary-deep" />
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="hidden h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-primary-faint hover:text-ink md:inline-flex"
              >
                <UserRound size={16} />
                ورود / ثبت‌نام
              </button>
            )}

            <Link to="/doctors" className="hidden sm:block">
              <Button size="sm" className="!h-10 !px-4">
                <CalendarPlus size={15} />
                دریافت نوبت
              </Button>
            </Link>

            {/* منوی موبایل */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-primary-faint lg:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {menuOpen && (
          <div className="animate-fade-in border-t border-line bg-white px-4 pb-6 pt-3 shadow-card lg:hidden">
            <nav aria-label="ناوبری موبایل" className="flex flex-col">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-3 text-[15px] font-medium transition-colors',
                      isActive ? 'bg-primary-faint font-bold text-ink' : 'text-ink-soft hover:bg-primary-faint/70 hover:text-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <Link to="/account">
                  <Button variant="outline" block>
                    <UserRound size={16} />
                    حساب من
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" block onClick={() => setLoginOpen(true)}>
                  <UserRound size={16} />
                  ورود / ثبت‌نام
                </Button>
              )}
              <Link to="/doctors">
                <Button block>
                  <CalendarPlus size={16} />
                  دریافت نوبت
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
