import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toFa } from '../../lib/utils';

const items = [
  {
    title: 'پزشکان تأییدشده',
    desc: 'هر پزشک پیش از حضور در پزشک‌یار، پروانه فعالیت و سوابقش توسط تیم ما بررسی می‌شود.',
  },
  {
    title: 'رزرو آنلاین سریع',
    desc: 'نوبت خود را در کمتر از ۲ دقیقه و بدون تماس تلفنی رزرو کنید؛ بدون صف و انتظار.',
  },
  {
    title: 'اطلاعات شفاف',
    desc: 'قیمت ویزیت، تخصص و نظرات واقعی بیماران بدون ابهام در دید شماست. بدون هزینه پنهان.',
  },
  {
    title: 'یادآوری نوبت',
    desc: 'چند ساعت قبل از نوبتتان به شما یادآوری می‌کنیم تا هیچ ویزیتی از دستتان در نرود.',
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-line bg-white" aria-labelledby="trust-title">
      <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-2">
            <h2 id="trust-title" className="text-2xl font-extrabold leading-relaxed text-ink">
              چرا پزشک‌یار؟
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              ما پزشک‌یار را برای یک هدف ساده ساختیم: پیدا کردن یک پزشک خوب نباید سرگرم‌کننده باشد. همه‌چیز در
              پلتفرم ما حول همین اصل طراحی شده است.
            </p>
            <Link
              to="/about"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep transition-colors hover:text-[#123c56]"
            >
              بیشتر درباره ما بخوانید
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-3">
            {items.map((item, i) => (
              <div key={item.title} className="border-t-2 border-line pt-5">
                <span className="text-[13px] font-black text-primary-700">{toFa(String(i + 1).padStart(2, '0'))}</span>
                <h3 className="mt-2 text-[15px] font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
