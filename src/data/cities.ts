import type { City } from '../types';

export const cities: City[] = [
  { id: 'tehran', name: 'تهران' },
  { id: 'isfahan', name: 'اصفهان' },
  { id: 'shiraz', name: 'شیراز' },
  { id: 'tabriz', name: 'تبریز' },
  { id: 'mashhad', name: 'مشهد' },
  { id: 'kerman', name: 'کرمان' },
  { id: 'qom', name: 'قم' },
  { id: 'rasht', name: 'رشت' },
];

export function cityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}
