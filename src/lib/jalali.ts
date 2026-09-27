import { toGregorian, toJalaali, isValidJalaaliDate, jalaaliMonthLength } from 'jalaali-js';
import { toFa } from './utils';

export interface JDate {
  jy: number;
  jm: number;
  jd: number;
}

export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/** شروع هفته: شنبه */
export const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
export const WEEKDAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export function today(): JDate {
  const d = new Date();
  const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { jy, jm, jd };
}

function toGregorianParts(j: JDate) {
  const { gy, gm, gd } = toGregorian(j.jy, j.jm, j.jd);
  return { gy, gm, gd };
}

/** ۰ = شنبه ... ۶ = جمعه */
export function weekdayOf(j: JDate): number {
  const g = toGregorianParts(j);
  const dow = new Date(g.gy, g.gm - 1, g.gd).getDay();
  return (dow + 1) % 7;
}

export function addDays(j: JDate, days: number): JDate {
  const g = toGregorianParts(j);
  const d = new Date(g.gy, g.gm - 1, g.gd);
  d.setDate(d.getDate() + days);
  const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { jy, jm, jd };
}

export function daysInMonth(jy: number, jm: number): number {
  return jalaaliMonthLength(jy, jm);
}

export function isValid(j: JDate): boolean {
  return isValidJalaaliDate(j.jy, j.jm, j.jd);
}

export function isSame(a: JDate | null, b: JDate | null): boolean {
  if (!a || !b) return false;
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

export function formatShort(j: JDate): string {
  return `${toFa(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toFa(j.jy)}`;
}

export function formatFull(j: JDate): string {
  return `${WEEKDAYS[weekdayOf(j)]}، ${toFa(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toFa(j.jy)}`;
}

export function monthName(j: JDate): string {
  return `${JALALI_MONTHS[j.jm - 1]} ${toFa(j.jy)}`;
}

export interface CalendarCell {
  j: JDate;
  inMonth: boolean;
}

/** ۴۲ خانه برای نمایش ماه (شروع از شنبه) */
export function monthCells(jy: number, jm: number): CalendarCell[] {
  const first: JDate = { jy, jm, jd: 1 };
  const offset = weekdayOf(first);
  const start = addDays(first, -offset);
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const j = addDays(start, i);
    cells.push({ j, inMonth: j.jm === jm });
  }
  return cells;
}

export const MORNING_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
export const EVENING_SLOTS = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

export function faTime(t: string): string {
  return toFa(t);
}

import { hashCode } from './utils';

/** وضعیت قطعی اشغال‌بودن هر ساعت (بر اساس پزشک + تاریخ) */
export function isSlotBooked(seed: string, time: string): boolean {
  return hashCode(`${seed}|${time}`) % 100 < 38;
}
