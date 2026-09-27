import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

type SocialIconProps = { size?: number };

/** آیکون اینستاگرام (استایل خطی lucide) */
function Instagram({ size = 17 }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/** آیکون لینکدین (استایل خطی lucide) */
function Linkedin({ size = 17 }: SocialIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { Wordmark } from './LogoMark';

const columns = [
  {
    title: 'پزشک‌یار',
    links: [
      { label: 'درباره ما', to: '/about' },
      { label: 'تماس با ما', to: '/about' },
      { label: 'فرصت‌های شغلی', to: '/about' },
      { label: 'حریم خصوصی', to: '/about' },
    ],
  },
  {
    title: 'برای بیماران',
    links: [
      { label: 'جستجوی پزشک', to: '/doctors' },
      { label: 'رزرو نوبت', to: '/doctors' },
      { label: 'مشاوره آنلاین', to: '/doctors?online=1' },
      { label: 'نوبت‌های من', to: '/account?tab=appointments' },
    ],
  },
  {
    title: 'برای پزشکان',
    links: [
      { label: 'ثبت‌نام پزشکان', to: '/about' },
      { label: 'پنل پزشک', to: '/about' },
      { label: 'شرایط همکاری', to: '/about' },
    ],
  },
  {
    title: 'راهنما',
    links: [
      { label: 'سؤالات متداول', to: '/#faq' },
      { label: 'راهنمای رزرو نوبت', to: '/about' },
      { label: 'مجله پزشکی', to: '/magazine' },
      { label: 'کلینیک‌ها', to: '/clinics' },
    ],
  },
];

const socials = [
  { label: 'اینستاگرام', Icon: Instagram },
  { label: 'تلگرام', Icon: Send },
  { label: 'لینکدین', Icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white pb-20 lg:pb-0">
      <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink-soft">
              پزشک‌یار پلتفرم پیدا کردن پزشک مورد اعتماد و رزرو آنلاین نوبت است؛ با اطلاعات شفاف، پزشکان تأییدشده و
              رزرو در چند دقیقه.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-primary hover:bg-primary-faint hover:text-primary-deep"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13px] text-ink-soft transition-colors hover:text-primary-deep">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© ۱۴۰۵ پزشک‌یار — تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-4">
            <Link to="/about" className="transition-colors hover:text-ink-soft">
              شرایط استفاده
            </Link>
            <Link to="/about" className="transition-colors hover:text-ink-soft">
              حریم خصوصی
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
