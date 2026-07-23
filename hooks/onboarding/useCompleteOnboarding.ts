import {
  getIosNotificationPermissionStatus,
  hasGrantedIosNotificationPermission,
  requestIosNotificationPermission,
} from '@/utils/notificationPermission';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, AppState, Linking, Platform } from 'react-native';

/**
 * 온보딩 마지막 단계 완료 처리.
 * iOS 알림 권한을 요청하고(거절 시 설정 안내), 완료되면 홈으로 이동한다.
 * 설정에서 권한을 켜고 앱으로 돌아오면 자동으로 홈 이동을 재시도한다.
 *
 * 기존 test/result 화면의 "시작하기" 로직을 그대로 옮긴 것으로,
 * 온보딩(목표 → 이름) 흐름의 종료 지점에서 재사용한다.
 */
export function useCompleteOnboarding() {
  const router = useRouter();
  const shouldRecheckPermissionOnActive = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' || !shouldRecheckPermissionOnActive.current) {
        return;
      }

      shouldRecheckPermissionOnActive.current = false;

      void (async () => {
        const permission = await getIosNotificationPermissionStatus();
        if (permission && hasGrantedIosNotificationPermission(permission)) {
          router.replace('/home');
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  const complete = async () => {
    if (Platform.OS !== 'ios') {
      router.replace('/home');
      return;
    }

    const hasPermission = await requestIosNotificationPermission();

    if (!hasPermission) {
      Alert.alert(
        '알림 권한이 꺼져 있어요',
        'iOS에서는 한 번 거절하면 앱 설정에서 다시 켜야 해요.',
        [
          {
            text: '나중에',
            style: 'cancel',
            onPress: () => router.replace('/home'),
          },
          {
            text: '설정 열기',
            onPress: () => {
              shouldRecheckPermissionOnActive.current = true;
              void Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

    router.replace('/home');
  };

  return { complete };
}
