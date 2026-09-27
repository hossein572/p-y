import type { Specialty } from '../types';

export const specialties: Specialty[] = [
  {
    id: 'cardiology',
    name: 'قلب و عروق',
    description: 'تشخیص و درمان بیماری‌های قلب، عروق و فشار خون',
    icon: 'heart',
  },
  {
    id: 'dermatology',
    name: 'پوست، مو و ناخن',
    description: 'درمان آکنه، لک، ریزش مو و بیماری‌های پوستی',
    icon: 'skin',
  },
  {
    id: 'neurology',
    name: 'مغز و اعصاب',
    description: 'سردرد مزمن، میگرن، اختلال خواب و بیماری‌های عصبی',
    icon: 'brain',
  },
  {
    id: 'dentistry',
    name: 'دندان‌پزشکی',
    description: 'درمان ریشه، ایمپلنت، ارتودنسی و زیبایی دندان',
    icon: 'tooth',
  },
  {
    id: 'ophthalmology',
    name: 'چشم‌پزشکی',
    description: 'بررسی بینایی، قطره‌نویسی و مشاوره جراحی لیزیک',
    icon: 'eye',
  },
  {
    id: 'obstetrics',
    name: 'زنان و زایمان',
    description: 'مراقبت از دوران بارداری، لانه‌گذاشتن و مسائل زنان',
    icon: 'baby',
  },
  {
    id: 'orthopedics',
    name: 'ارتوپدی',
    description: 'درمان درد مفاصل و ستون فقرات، شکستگی‌ها و جراحی ارتوپد',
    icon: 'bone',
  },
  {
    id: 'internal',
    name: 'طب داخلی',
    description: 'چکاپ، قند و چربی خون، مشکلات گوارشی و کنترل بیماری‌های مزمن',
    icon: 'stethoscope',
  },
  {
    id: 'pediatrics',
    name: 'اطفال',
    description: 'سلامت، تغذیه، واکسیناسیون و بیماری‌های کودکان و نوزادان',
    icon: 'child',
  },
  {
    id: 'psychiatry',
    name: 'روان‌پزشکی',
    description: 'درمان افسردگی، اضطراب و اختلالات خلقی و خواب',
    icon: 'mind',
  },
  {
    id: 'ent',
    name: 'گوش، حلق و بینی',
    description: 'کاهش شنوایی، سینوزیت، آلرژی و مشکلات تنفسی',
    icon: 'ear',
  },
  {
    id: 'surgery',
    name: 'جراحی عمومی',
    description: 'جراحی‌های شکمی، تیروئید، فتق و فیبروم',
    icon: 'scalpel',
  },
];

export function specialtyById(id: string): Specialty | undefined {
  return specialties.find((s) => s.id === id);
}
