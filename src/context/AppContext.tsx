import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type { Appointment, NotificationItem, User } from '../types';
import { seedAppointments } from '../data/appointments';
import { seedNotifications } from '../data/notifications';
import { seedAddresses } from '../data/addresses';
import type { Address } from '../types';

export interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error' | 'info';
}

interface AppContextValue {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;

  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  cancelAppointment: (id: string) => void;

  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;

  addresses: Address[];
  addAddress: (a: Address) => void;
  removeAddress: (id: string) => void;

  toasts: Toast[];
  toast: (message: string, kind?: Toast['kind']) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function usePersistent<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue];
}

const SEED_USER: User = {
  name: 'سارا محمدی',
  phone: '09121234567',
  email: 'sara.mohammadi@example.com',
  gender: 'f',
  birthYear: 1375,
};

let toastSeq = 0;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = usePersistent<User | null>('py:user', SEED_USER);
  const [favorites, setFavorites] = usePersistent<string[]>('py:favorites', ['d1', 'd3']);
  const [appointments, setAppointments] = usePersistent<Appointment[]>('py:appointments', seedAppointments);
  const [notifications, setNotifications] = usePersistent<NotificationItem[]>('py:notifications', seedNotifications);
  const [addresses, setAddresses] = usePersistent<Address[]>('py:addresses', seedAddresses);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: Toast['kind'] = 'success') => {
      const id = ++toastSeq;
      setToasts((t) => [...t.slice(-2), { id, message, kind }]);
      window.setTimeout(() => dismissToast(id), 3600);
    },
    [dismissToast],
  );

  const login = useCallback(
    (u: User) => {
      setUser(u);
      toast(`خوش آمدید، ${u.name}`, 'success');
    },
    [setUser, toast],
  );

  const logout = useCallback(() => {
    setUser(null);
    toast('از حساب خود خارج شدید', 'info');
  }, [setUser, toast]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((f) => {
        if (f.includes(id)) {
          toast('پزشک از علاقه‌مندی‌ها حذف شد', 'info');
          return f.filter((x) => x !== id);
        }
        toast('به علاقه‌مندی‌ها اضافه شد', 'success');
        return [...f, id];
      });
    },
    [setFavorites, toast],
  );

  const addAppointment = useCallback(
    (a: Appointment) => {
      setAppointments((list) => [a, ...list]);
    },
    [setAppointments],
  );

  const cancelAppointment = useCallback(
    (id: string) => {
      setAppointments((list) => list.map((a) => (a.id === id ? { ...a, state: 'cancelled' as const } : a)));
      toast('نوبت شما لغو شد', 'info');
    },
    [setAppointments, toast],
  );

  const markRead = useCallback(
    (id: string) => {
      setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [setNotifications],
  );

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const addAddress = useCallback(
    (a: Address) => {
      setAddresses((list) => [...list, a]);
      toast('آدرس جدید اضافه شد', 'success');
    },
    [setAddresses, toast],
  );

  const removeAddress = useCallback(
    (id: string) => {
      setAddresses((list) => list.filter((a) => a.id !== id));
      toast('آدرس حذف شد', 'info');
    },
    [setAddresses, toast],
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value: AppContextValue = {
    user,
    login,
    logout,
    favorites,
    isFavorite,
    toggleFavorite,
    appointments,
    addAppointment,
    cancelAppointment,
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    addresses,
    addAddress,
    removeAddress,
    toasts,
    toast,
    dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp باید داخل AppProvider استفاده شود');
  return ctx;
}
