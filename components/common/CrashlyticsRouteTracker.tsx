import crashlytics from '@react-native-firebase/crashlytics';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

export function CrashlyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 화면 전환 애니메이션이 끝난 뒤에 호출 (전환 중 호출 시 네이티브 모듈 크래시 발생 이력 있음)
    const task = InteractionManager.runAfterInteractions(() => {
      try {
        crashlytics().setAttribute('route', pathname ?? 'unknown');
        crashlytics().log(`route: ${pathname}`);
      } catch (e) {
        console.log('[CrashlyticsRouteTracker] failed to log route:', e);
      }
    });

    return () => task.cancel();
  }, [pathname]);

  return null;
}
