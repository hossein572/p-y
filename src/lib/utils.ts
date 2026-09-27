export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** تبدیل ارقام لاتین به فارسی */
export function toFa(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** 450000 -> ۴۵۰٬۰۰۰ */
export function formatPrice(price: number): string {
  return toFa(Math.round(price).toLocaleString('en-US').replace(/,/g, '٬'));
}

/** 12500 -> ۱۲٬۵۰۰ */
export function formatNumber(n: number): string {
  return toFa(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬'));
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** هش قطعی برای تولید وضعیت‌های ثابت (نوبت‌های پر، رنگ آواتار و...) */
export function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** «دکتر نگار موسوی» -> «ن م» */
export function initialsOf(name: string): string {
  const words = name
    .replace(/^دکتر\s*/g, '')
    .replace(/[،.]/g, ' ')
    .split(' ')
    .filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const second = words[1]?.[0] ?? '';
  return first + (second ? ` ${second}` : '');
}

export const AVATAR_TONES = [
  { bg: '#DDF1FC', fg: '#174A6B' },
  { bg: '#E4F4EE', fg: '#1F6B51' },
  { bg: '#FBF1DD', fg: '#8A5E1C' },
  { bg: '#F3EAF7', fg: '#5B3B72' },
  { bg: '#FDEBEE', fg: '#8A3B45' },
  { bg: '#E7F2E3', fg: '#3D6B2E' },
] as const;

export function avatarTone(name: string): { bg: string; fg: string } {
  return AVATAR_TONES[hashCode(name) % AVATAR_TONES.length];
}

/** کد پیگیری نوبت */
export function trackingCode(jy: number, jm: number, jd: number, seed: number): string {
  const n = (hashCode(String(seed)) % 9000) + 1000;
  return `PY-${jy}${pad2(jm)}${pad2(jd)}-${toFa(n)}`;
}
