export interface City {
  id: string;
  name: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type ServiceType = 'in-person' | 'online' | 'follow-up' | 'special';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  duration: number;
  price: number;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  cityId: string;
  clinicId: string;
  gender: 'm' | 'f';
  experience: number;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  verified: boolean;
  licenseNo: string;
  image: string;
  address: string;
  bio: string;
  education: string[];
  achievements: string[];
  nextFree: { label: string; time: string };
  services: Service[];
}

export interface Review {
  id: string;
  doctorId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  visit: string;
}

export interface Clinic {
  id: string;
  name: string;
  cityId: string;
  address: string;
  phone: string;
  rating: number;
  doctorIds: string[];
  specialtyIds: string[];
  description: string;
  hours: string;
  features: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: number;
  date: string;
  author: string;
  authorRole: string;
  content: string[];
}

export type AppointmentState = 'confirmed' | 'pending' | 'cancelled' | 'done';

export interface Appointment {
  id: string;
  code: string;
  doctorId: string;
  serviceName: string;
  visitType: 'in-person' | 'online';
  jy: number;
  jm: number;
  jd: number;
  time: string;
  price: number;
  state: AppointmentState;
  note?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: 'success' | 'info' | 'warning';
}

export interface User {
  name: string;
  phone: string;
  email: string;
  gender: 'm' | 'f';
  birthYear: number;
}

export interface Address {
  id: string;
  label: string;
  detail: string;
  city: string;
  primary: boolean;
}
