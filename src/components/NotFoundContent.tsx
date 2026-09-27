import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from './ui/Button';

export function NotFoundContent({ title = 'این صفحه پیدا نشد', description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-primary-soft bg-primary-faint text-primary-700">
        <Compass size={28} />
      </div>
      <h1 className="mt-5 text-xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-7 text-ink-soft">
        {description ?? 'صفحه‌ای که به دنبال آن بودید وجود ندارد یا جابه‌جا شده است.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/">
          <Button>بازگشت به خانه</Button>
        </Link>
        <Link to="/doctors">
          <Button variant="outline">جستجوی پزشک</Button>
        </Link>
      </div>
    </div>
  );
}
