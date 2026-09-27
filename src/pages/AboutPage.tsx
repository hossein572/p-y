import { Link } from 'react-router-dom';
import { ArrowLeft, HeartPulse, ShieldCheck, Zap } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';
import { formatNumber, toFa } from '../lib/utils';

const stats = [
  { value: `${formatNumber(12500)}+`, label: 'پزشک تأییدشده' },
  { value: toFa(10), label: 'کلینیک همکار' },
  { value: '٪۹۶', label: 'رضایت بیماران' },
  { value: '٪۹۸', label: 'نوبت‌های در ساعت مقرر' },
];

const values = [
  {
    title: 'اعتماد، از اولین کلیک',
    desc: 'هر اطلاعاتی که می‌بینید — از قیمت ویزیت تا نظرات بیماران — بررسی و تأیید شده است. چیزی پنهان، اینجا وجود ندارد.',
    Icon: ShieldCheck,
  },
  {
    title: 'ساده و سریع',
    desc: 'رزرو نوبت باید به اندازه یک پیامک سریع باشد. ما هر قدم اضافه را از مسیر شما حذف کرده‌ایم.',
    Icon: Zap,
  },
  {
    title: 'انسانی، در همه‌چیز',
    desc: 'از لحن پیام‌ها تا طراحی رابط، همه‌چیز برای آرامش بیمار طراحی شده است. پزشکی باید بدون استرس باشد.',
    Icon: HeartPulse,
  },
];

export function AboutPage() {
  usePageTitle('درباره ما');

  return (
    <div className="mx-auto max-w-container px-4 py-6 sm:px-6 lg:px-8">
      {/* معرفی */}
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-balance text-2xl font-black leading-[1.5] text-ink sm:text-4xl sm:leading-[1.4]">
            پزشک‌یار برای یک هدف ساده ساخته شد:
            <br />
            <span className="text-primary-deep">دسترسی آسان به پزشک خوب</span>
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-ink-soft">
            پیدا کردن یک پزشک قابل‌اعتماد، فهمیدن قیمت واقعی ویزیت و گرفتن نوبت در ساعت مقرر — کارهایی هستند که سال‌ها
            وقت و انرژی گرفته‌اند. ما در پزشک‌یار این مسیر را کوتاه کردیم: اطلاعات شفاف، پزشکان تأییدشده و رزرو آنلاین
            در کمتر از ۲ دقیقه.
          </p>
          <p className="mt-3 text-[15px] leading-8 text-ink-soft">
            امروز پزشک‌یار در ۸ شهر فعال است و روزانه صدها نوبت از طریق پلتفرم ما انجام می‌شود.
          </p>
          <div className="mt-6">
            <Link to="/doctors">
              <Button size="lg">
                جستجوی پزشک
                <ArrowLeft size={16} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line shadow-card">
          <img src="/images/about.jpg" alt="تیم پزشک‌یار در راهرو کلینیک" className="aspect-[4/3] w-full object-cover" />
        </div>
      </div>

      {/* آمار */}
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-5 py-6 text-center">
            <div className="text-2xl font-black text-primary-deep sm:text-3xl">{s.value}</div>
            <div className="mt-1.5 text-[13px] text-ink-soft">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ارزش‌ها */}
      <div className="mt-12">
        <h2 className="text-xl font-extrabold text-ink sm:text-2xl">ارزش‌هایی که برایشان کار می‌کنیم</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {values.map(({ title, desc, Icon }) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-light text-primary-deep">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-[15px] font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-[13px] leading-7 text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* تماس */}
      <div className="mt-12 rounded-2xl border border-primary-soft bg-primary-faint p-6 text-center sm:p-10">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">سؤالی دارید؟ با ما در تماس باشید</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-soft">
          تیم پشتیبانی پزشک‌یار همه‌روزه از ۰۹:۰۰ تا ۲۱:۰۰ آماده پاسخ‌گویی است.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <span className="font-bold text-ink" dir="ltr">
            ۰۲۱-۹۱۰۰۴۵۶۷
          </span>
          <span className="font-bold text-ink" dir="ltr">
            support@pezeshkyar.ir
          </span>
        </div>
      </div>
    </div>
  );
}
