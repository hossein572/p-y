import { usePageTitle } from '../hooks/usePageTitle';
import { NotFoundContent } from '../components/NotFoundContent';

export function NotFoundPage() {
  usePageTitle('صفحه پیدا نشد');
  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
      <NotFoundContent title="صفحه‌ای که می‌خواستید پیدا نشد" />
    </div>
  );
}
