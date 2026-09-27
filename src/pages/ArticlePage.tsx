import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Clock, UserRound } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { articleBySlug, articles, categoryName } from '../data/articles';
import { ArticleCover } from '../components/ArticleCover';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { NotFoundContent } from '../components/NotFoundContent';
import { toFa } from '../lib/utils';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articleBySlug(slug ?? '');
  usePageTitle(article?.title);

  if (!article) {
    return (
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-8">
        <NotFoundContent title="مقاله پیدا نشد" />
      </div>
    );
  }

  const related = articles.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <Link to="/magazine" className="mb-5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink">
        <ChevronLeft size={14} />
        بازگشت به مجله
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone="info">{categoryName(article.category)}</Badge>
          <span className="flex items-center gap-1 text-xs text-ink-faint">
            <Clock size={12} />
            {toFa(article.readTime)} دقیقه مطالعه
          </span>
          <span className="text-xs text-ink-faint">{article.date}</span>
        </div>
        <h1 className="mt-4 text-balance text-2xl font-black leading-[1.5] text-ink sm:text-3xl sm:leading-[1.5]">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <Avatar name={article.author} size={40} />
          <div>
            <div className="text-[13px] font-bold text-ink">{article.author}</div>
            <div className="mt-0.5 text-[11px] text-ink-faint">{article.authorRole}</div>
          </div>
        </div>
      </header>

      <ArticleCover category={article.category} className="mt-6 h-56 w-full rounded-2xl border border-line sm:h-72" />

      <div className="mt-7 space-y-5">
        {article.content.map((block, i) =>
          block.startsWith('## ') ? (
            <h2 key={i} className="pt-2 text-lg font-extrabold leading-8 text-ink">
              {block.slice(3)}
            </h2>
          ) : (
            <p key={i} className="text-[15px] leading-9 text-ink/85">
              {block}
            </p>
          ),
        )}
      </div>

      {/* نویسنده */}
      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card">
        <Avatar name={article.author} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
            <UserRound size={14} className="text-primary-700" />
            {article.author}
          </div>
          <div className="mt-0.5 text-xs text-ink-soft">{article.authorRole}</div>
        </div>
        <span className="hidden text-[11px] leading-5 text-ink-faint sm:block">
          این مقاله توسط تیم
          <br />
          علمی پزشک‌یار بازبینی شده است
        </span>
      </div>

      {/* مرتبط */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-ink">مقالات مرتبط</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to={`/magazine/${a.slug}`}
                className="group overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-soft hover:shadow-card-hover"
              >
                <ArticleCover category={a.category} className="h-28 w-full" />
                <div className="p-3.5">
                  <h3 className="line-clamp-2 text-[13px] font-bold leading-6 text-ink transition-colors group-hover:text-primary-deep">
                    {a.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-ink-faint">
                    <Clock size={10} />
                    {toFa(a.readTime)} دقیقه
                    <span className="ms-auto flex items-center gap-0.5 font-bold text-primary-deep">
                      مطلب
                      <ArrowLeft size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
