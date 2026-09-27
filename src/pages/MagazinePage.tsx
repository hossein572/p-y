import {useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { articles, articleCategories, categoryName } from '../data/articles';
import { ArticleCover } from '../components/ArticleCover';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { cn, toFa } from '../lib/utils';

export function MagazinePage() {
  usePageTitle('مجله پزشکی');
  const loading = useSimulatedLoading(500);
  const [cat, setCat] = useState('');

  const filtered = useMemo(() => (cat ? articles.filter((a) => a.category === cat) : articles), [cat]);
  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">مجله پزشکی</h1>
        <p className="mt-1 text-sm text-ink-soft">مقالات علمی-ترویجی، بازبینی‌شده توسط پزشکان تیم پزشک‌یار</p>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="no-scrollbar -mx-4 mb-7 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          onClick={() => setCat('')}
          aria-pressed={!cat}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
            !cat ? 'border-primary-deep bg-primary-deep text-white' : 'border-line bg-white text-ink-soft hover:border-primary-soft hover:text-ink',
          )}
        >
          همه
        </button>
        {articleCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
              cat === c.id ? 'border-primary-deep bg-primary-deep text-white' : 'border-line bg-white text-ink-soft hover:border-primary-soft hover:text-ink',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-5">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="space-y-2.5 p-4">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* مقاله برتر */}
          {featured && (
            <Link
              to={`/magazine/${featured.slug}`}
              className="group mb-6 grid overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all hover:border-primary-soft hover:shadow-card-hover md:grid-cols-2"
            >
              <ArticleCover category={featured.category} className="h-52 md:h-full" />
              <div className="flex flex-col justify-center p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <Badge tone="info">{categoryName(featured.category)}</Badge>
                  <span className="flex items-center gap-1 text-[11px] text-ink-faint">
                    <Clock size={11} />
                    {toFa(featured.readTime)} دقیقه مطالعه
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-extrabold leading-8 text-ink transition-colors group-hover:text-primary-deep sm:text-xl">
                  {featured.title}
                </h2>
                <p className="mt-2.5 text-sm leading-7 text-ink-soft">{featured.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1 font-bold text-primary-deep">
                    ادامه مطلب
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* بقیه مقالات */}
          {rest.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-card">
              <BookOpen size={26} className="mx-auto text-ink-faint" />
              <p className="mt-3 text-sm font-bold text-ink">مقاله‌ای در این دسته پیدا نشد</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <Link
                  key={a.slug}
                  to={`/magazine/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-card-hover"
                >
                  <ArticleCover category={a.category} className="h-40 w-full" />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                      <Badge tone="info">{categoryName(a.category)}</Badge>
                      <span className="flex items-center gap-1 text-[11px] text-ink-faint">
                        <Clock size={11} />
                        {toFa(a.readTime)} دقیقه
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[15px] font-bold leading-7 text-ink transition-colors group-hover:text-primary-deep">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-6 text-ink-soft">{a.excerpt}</p>
                    <div className="mt-3 border-t border-line pt-3 text-[11px] text-ink-faint">{a.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
