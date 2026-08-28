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
 * 설정에서 권한을 켜고 앱으로 돌아오면 자동으로 이동을 재시도한다.
 *
 * 기존 test/result 화면의 "시작하기" 로직을 그대로 옮긴 것으로,
 * 온보딩(목표 → 이름) 흐름의 종료 지점에서 재사용한다.
 *
 * 원래 목적지는 /tutorial 이었으나 튜토리얼의 API 문제로 잠시 비활성화하고
 * 홈으로 바로 보낸다. app/tutorial.tsx 와 라우트 등록은 그대로 두었으므로,
 * 다시 켤 때는 이 파일의 ONBOARDING_DESTINATION 만 '/tutorial'로 되돌리면 된다.
 */

// 튜토리얼 재활성화 시 '/tutorial'로 되돌린다.
const ONBOARDING_DESTINATION = '/home' as const;
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
          router.replace(ONBOARDING_DESTINATION);
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  const complete = async () => {
    if (Platform.OS !== 'ios') {
      // Android 알림 권한은 로그인 시점(useEnableNotifications)에 이미 요청한다.
      router.replace(ONBOARDING_DESTINATION);
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
            onPress: () => router.replace(ONBOARDING_DESTINATION),
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

    router.replace(ONBOARDING_DESTINATION);
  };

  return { complete };
}
