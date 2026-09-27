import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { doctorById } from '../data/doctors';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function FavoritesPage() {
  usePageTitle('علاقه‌مندی‌ها');
  const { favorites } = useApp();
  const docs = favorites.map((id) => doctorById(id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">پزشکان مورد علاقه</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {docs.length > 0 ? `${docs.length} پزشک در لیست شماست` : 'پزشکانتان را دنبال کنید تا همیشه در دسترس باشند'}
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <EmptyState
            icon={<Heart size={26} />}
            title="هنوز پزشکی به لیست علاقه‌مندی‌های شما اضافه نشده است"
            description="با زدن روی آیکون قلب در کارت هر پزشک، او را به این لیست اضافه کنید و از نوبت‌های آزادش باخبر شوید."
            action={
              <Link to="/doctors">
                <Button>
                  <Search size={15} />
                  جستجوی پزشک
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map(
            (d) =>
              d && <DoctorCard key={d.id} doctor={d} />,
          )}
        </div>
      )}
    </div>
  );
}
