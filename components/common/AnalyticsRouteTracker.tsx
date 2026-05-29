import { logScreenView } from '@/utils/analytics';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

export function AnalyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    logScreenView(pathname ?? 'unknown');
  }, [pathname]);

  return null;
}
