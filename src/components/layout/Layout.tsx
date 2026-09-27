import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { ScrollToTop } from './ScrollToTop';
import { ToastHost } from '../ui/ToastHost';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-primary-deep focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        پرش به محتوای اصلی
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <ToastHost />
    </div>
  );
}
