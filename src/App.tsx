import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const SpecialtiesPage = lazy(() => import('./pages/SpecialtiesPage').then((m) => ({ default: m.SpecialtiesPage })));
const DoctorProfilePage = lazy(
  () => import('./pages/DoctorProfilePage').then((m) => ({ default: m.DoctorProfilePage })),
);
const BookingPage = lazy(() => import('./pages/BookingPage').then((m) => ({ default: m.BookingPage })));
const BookingSuccessPage = lazy(
  () => import('./pages/BookingSuccessPage').then((m) => ({ default: m.BookingSuccessPage })),
);
const ClinicsPage = lazy(() => import('./pages/ClinicsPage').then((m) => ({ default: m.ClinicsPage })));
const ClinicDetailPage = lazy(() => import('./pages/ClinicDetailPage').then((m) => ({ default: m.ClinicDetailPage })));
const MagazinePage = lazy(() => import('./pages/MagazinePage').then((m) => ({ default: m.MagazinePage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const NotificationsPage = lazy(
  () => import('./pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
);
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-container items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3" role="status" aria-label="در حال بارگذاری">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary-deep" aria-hidden />
        <span className="text-[13px] text-ink-soft">در حال بارگذاری…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/doctors"
              element={
                <Suspense fallback={<PageFallback />}>
                  <SearchPage />
                </Suspense>
              }
            />
            <Route
              path="/specialties"
              element={
                <Suspense fallback={<PageFallback />}>
                  <SpecialtiesPage />
                </Suspense>
              }
            />
            <Route
              path="/doctors/:id"
              element={
                <Suspense fallback={<PageFallback />}>
                  <DoctorProfilePage />
                </Suspense>
              }
            />
            <Route
              path="/book/success"
              element={
                <Suspense fallback={<PageFallback />}>
                  <BookingSuccessPage />
                </Suspense>
              }
            />
            <Route
              path="/book/:id"
              element={
                <Suspense fallback={<PageFallback />}>
                  <BookingPage />
                </Suspense>
              }
            />
            <Route
              path="/clinics"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ClinicsPage />
                </Suspense>
              }
            />
            <Route
              path="/clinics/:id"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ClinicDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/magazine"
              element={
                <Suspense fallback={<PageFallback />}>
                  <MagazinePage />
                </Suspense>
              }
            />
            <Route
              path="/magazine/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ArticlePage />
                </Suspense>
              }
            />
            <Route
              path="/account"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AccountPage />
                </Suspense>
              }
            />
            <Route
              path="/notifications"
              element={
                <Suspense fallback={<PageFallback />}>
                  <NotificationsPage />
                </Suspense>
              }
            />
            <Route
              path="/favorites"
              element={
                <Suspense fallback={<PageFallback />}>
                  <FavoritesPage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
