import type { Address } from '../types';

export const seedAddresses: Address[] = [
  {
    id: 'a1',
    label: 'خانه',
    detail: 'تهران، تجریش، خیابان دریا، کوچه لاله، پلاک ۴، واحد ۳',
    city: 'تهران',
    primary: true,
  },
  {
    id: 'a2',
    label: 'محل کار',
    detail: 'تهران، خیابان مولوی، خیابان فرشته، ساختمان پالس، طبقه ۷',
    city: 'تهران',
    primary: false,
  },
];
