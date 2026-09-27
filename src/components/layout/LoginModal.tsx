import React, {useState} from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FieldWrap, Input, Select } from '../ui/Field';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'f' | 'm'>('f');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: { name?: string; phone?: string } = {};
    if (name.trim().length < 3) errs.name = 'لطفاً نام کامل خود را وارد کنید';
    if (!/^09\d{9}$/.test(phone.trim())) errs.phone = 'شماره موبایل باید با ۰۹ شروع و ۱۱ رقم باشد';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    login({
      name: name.trim(),
      phone: phone.trim(),
      email: '',
      gender,
      birthYear: 1380,
    });
    onClose();
    setName('');
    setPhone('');
  }

  return (
    <Modal open={open} onClose={onClose} title="ورود / ثبت‌نام">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 p-5">
        <p className="text-[13px] leading-6 text-ink-soft">
          برای رزرو نوبت و مدیریت حساب خود وارد شوید. در این نسخه نمایشی، اطلاعات فقط در مرورگر شما ذخیره می‌شود.
        </p>
        <FieldWrap label="نام و نام خانوادگی" error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً سارا محمدی"
            invalid={!!errors.name}
            autoComplete="name"
          />
        </FieldWrap>
        <FieldWrap label="شماره موبایل" error={errors.phone}>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912XXXXXXX"
            invalid={!!errors.phone}
            inputMode="numeric"
            dir="ltr"
            className="text-end"
            autoComplete="tel"
          />
        </FieldWrap>
        <FieldWrap label="جنسیت">
          <Select value={gender} onChange={(e) => setGender(e.target.value as 'f' | 'm')}>
            <option value="f">خانم</option>
            <option value="m">آقا</option>
          </Select>
        </FieldWrap>
        <Button type="submit" block>
          ورود به حساب
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-faint">
          <ShieldCheck size={13} className="text-success" />
          اطلاعات شما به هیچ سروری ارسال نمی‌شود
        </p>
      </form>
    </Modal>
  );
}
