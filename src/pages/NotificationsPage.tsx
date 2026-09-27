import { Bell, BellOff, CheckCheck, Clock, Info } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { cn, toFa } from '../lib/utils';

const kindStyle = {
  success: { bg: 'bg-success-soft', fg: 'text-success', Icon: CheckCheck },
  info: { bg: 'bg-primary-light', fg: 'text-primary-deep', Icon: Info },
  warning: { bg: 'bg-warn-soft', fg: 'text-warn', Icon: Clock },
};

export function NotificationsPage() {
  usePageTitle('اعلان‌ها');
  const { notifications, unreadCount, markRead, markAllRead } = useApp();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">اعلان‌ها</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {unreadCount > 0 ? `${toFa(unreadCount)} اعلان خوانده‌نشده دارید` : 'همه اعلان‌ها را خوانده‌اید'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck size={15} />
            خواندن همه
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <EmptyState
            icon={<BellOff size={26} />}
            title="اعلانی ندارید"
            description="اگر نوبتی رزرو کنید، یادآوری‌ها و تأییدها همین‌جا نمایش داده می‌شود."
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <ul className="divide-y divide-line">
            {notifications.map((n) => {
              const { bg, fg, Icon } = kindStyle[n.kind];
              return (
                <li key={n.id}>
                  <button
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'flex w-full items-start gap-3.5 px-4 py-4 text-start transition-colors sm:px-5',
                      n.read ? 'opacity-70 hover:opacity-100' : 'bg-primary-faint/40 hover:bg-primary-faint/70',
                    )}
                    aria-label={n.read ? n.title : `خوانده‌نشده: ${n.title}`}
                  >
                    <span className={cn('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg', bg, fg)}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-ink">{n.title}</span>
                        <span className="shrink-0 text-[11px] text-ink-faint">{n.time}</span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-6 text-ink-soft">{n.body}</span>
                    </span>
                    {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-danger" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line bg-surface px-5 py-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-faint">
              <Bell size={12} />
              یادآوری نوبت‌ها چند ساعت قبل از موعد ارسال می‌شود
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
