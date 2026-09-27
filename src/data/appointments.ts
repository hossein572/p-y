import type { Appointment, AppointmentState } from '../types';
import { addDays, faTime, today } from '../lib/jalali';
import { hashCode, pad2 } from '../lib/utils';

interface Seed {
  doctorId: string;
  serviceName: string;
  visitType: 'in-person' | 'online';
  offset: number;
  time: string;
  state: AppointmentState;
  price: number;
}

const seeds: Seed[] = [
  // نوبت‌های آینده
  { doctorId: 'd1', serviceName: 'ویزیت پیگیری', visitType: 'in-person', offset: 1, time: '18:00', state: 'confirmed', price: 400000 },
  { doctorId: 'd3', serviceName: 'ویزیت حضوری', visitType: 'in-person', offset: 2, time: '10:00', state: 'pending', price: 700000 },
  { doctorId: 'd2', serviceName: 'مشاوره آنلاین', visitType: 'online', offset: 3, time: '20:30', state: 'confirmed', price: 380000 },
  { doctorId: 'd13', serviceName: 'جلسه روان‌درمانی شناختی', visitType: 'online', offset: 6, time: '19:00', state: 'pending', price: 850000 },
  // لغوشده
  { doctorId: 'd6', serviceName: 'ویزیت حضوری', visitType: 'in-person', offset: -2, time: '09:30', state: 'cancelled', price: 450000 },
  // نوبت‌های انجام‌شده
  { doctorId: 'd1', serviceName: 'ویزیت حضوری', visitType: 'in-person', offset: -3, time: '14:30', state: 'done', price: 850000 },
  { doctorId: 'd9', serviceName: 'ویزیت حضوری', visitType: 'in-person', offset: -7, time: '12:00', state: 'done', price: 500000 },
  { doctorId: 'd3', serviceName: 'مشاوره آنلاین', visitType: 'online', offset: -10, time: '21:00', state: 'done', price: 450000 },
  { doctorId: 'd2', serviceName: 'چکاپ کامل', visitType: 'in-person', offset: -14, time: '09:00', state: 'done', price: 1200000 },
  { doctorId: 'd7', serviceName: 'درمان ریشه با میکروسکوپ', visitType: 'in-person', offset: -20, time: '09:00', state: 'done', price: 1300000 },
  { doctorId: 'd4', serviceName: 'ویزیت پیگیری', visitType: 'in-person', offset: -24, time: '12:30', state: 'done', price: 400000 },
  { doctorId: 'd1', serviceName: 'ویزیت تخصصی با اکوکاردیوگرافی', visitType: 'in-person', offset: -31, time: '11:00', state: 'done', price: 1450000 },
  { doctorId: 'd15', serviceName: 'ویزیت پیگیری', visitType: 'in-person', offset: -38, time: '10:00', state: 'done', price: 210000 },
  { doctorId: 'd6', serviceName: 'ویزیت سه‌ماهه با سونوگرافی', visitType: 'in-person', offset: -45, time: '09:30', state: 'done', price: 1300000 },
  { doctorId: 'd3', serviceName: 'درمان لک با لیزر (جلسه)', visitType: 'in-person', offset: -52, time: '15:00', state: 'done', price: 1800000 },
  { doctorId: 'd13', serviceName: 'ویزیت حضوری', visitType: 'in-person', offset: -60, time: '17:00', state: 'done', price: 620000 },
  { doctorId: 'd2', serviceName: 'ویزیت پیگیری', visitType: 'in-person', offset: -68, time: '16:00', state: 'done', price: 280000 },
  { doctorId: 'd10', serviceName: 'ارزیابی جراحی لاپاراسکوپیک', visitType: 'in-person', offset: -75, time: '10:30', state: 'done', price: 1200000 },
  { doctorId: 'd9', serviceName: 'بررسی رشد و واکسیناسیون', visitType: 'in-person', offset: -88, time: '11:00', state: 'done', price: 750000 },
  { doctorId: 'd1', serviceName: 'مشاوره آنلاین', visitType: 'online', offset: -95, time: '20:00', state: 'done', price: 580000 },
];

export const seedAppointments: Appointment[] = seeds.map((s, i) => {
  const t = today();
  const d = addDays(t, s.offset);
  const seedNum = hashCode(`${s.doctorId}-${s.offset}`);
  return {
    id: `ap-${i}`,
    code: `PY-${d.jy}${pad2(d.jm)}${pad2(d.jd)}-${faTime(String(1000 + (seedNum % 9000)))}`,
    doctorId: s.doctorId,
    serviceName: s.serviceName,
    visitType: s.visitType,
    jy: d.jy,
    jm: d.jm,
    jd: d.jd,
    time: s.time,
    price: s.price,
    state: s.state,
  };
});
