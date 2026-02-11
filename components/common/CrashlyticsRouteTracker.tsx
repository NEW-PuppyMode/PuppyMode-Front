import crashlytics from '@react-native-firebase/crashlytics';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

export function CrashlyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 크래시 직전에 마지막으로 방문한 route를 남기기
    crashlytics().setAttribute('route', pathname ?? 'unknown');
    crashlytics().log(`route: ${pathname}`);
  }, [pathname]);

  return null;
}
