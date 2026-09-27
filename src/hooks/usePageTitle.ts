
import {useEffect} from 'react';
const SUFFIX = ' | پزشک‌یار';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title}${SUFFIX}` : 'پزشک‌یار | رزرو آنلاین نوبت پزشکی';
  }, [title]);
}
