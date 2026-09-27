
import {useEffect, useState} from 'react';
/** شبیه‌سازی لودینگ شبکه برای نمایش Skeleton states */
export function useSimulatedLoading(ms = 550, deps: unknown[] = []): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}
