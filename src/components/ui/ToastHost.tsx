import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <CheckCircle2 size={16} className="text-[#7FD6B4]" />,
  error: <XCircle size={16} className="text-[#F0A3A3]" />,
  info: <Info size={16} className="text-primary-soft" />,
};

export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto flex max-w-full animate-fade-up items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-card-hover"
        >
          {icons[t.kind]}
          <span className="truncate">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
