import {useEffect, useRef} from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * رفتار استاندارد دیالوگ: قفل اسکرول بدنه، فوکوس روی پنل،
 * دام فوکوس (Tab درون دیالوگ می‌چرخد)، Escape برای بستن و بازگرداندن فوکوس هنگام بستن.
 */
export function useDialogBehavior(open: boolean, onClose: () => void, panelRef: React.RefObject<HTMLElement | null>) {
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActive.current = (document.activeElement as HTMLElement) ?? null;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 30);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = '';
      lastActive.current?.focus?.();
      lastActive.current = null;
    };
  }, [open, onClose, panelRef]);
}
