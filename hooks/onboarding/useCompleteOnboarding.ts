import {
  getIosNotificationPermissionStatus,
  hasGrantedIosNotificationPermission,
  requestIosNotificationPermission,
} from '@/utils/notificationPermission';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import type { MeResult } from '@/services/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, Linking, Platform } from 'react-native';

/**
 * 최초 온보딩 마지막 단계 완료 처리.
 * iOS 알림 권한을 요청하고(거절 시 설정 안내), 완료되면 다음 화면으로 이동한다.
 * 설정에서 권한을 켜고 앱으로 돌아오면 자동으로 이동을 재시도한다.
 *
 * 기존 test/result 화면의 "시작하기" 로직을 그대로 옮긴 것으로,
 * 온보딩(이름 → 목표) 흐름의 종료 지점에서 재사용한다.
 *
 * 매월 돌아오는 목표 갱신(app/goal)은 이 훅을 쓰지 않는다. 갱신 때마다 알림
 * 권한을 다시 묻게 되기 때문이다.
 */
export function useCompleteOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const shouldRecheckPermissionOnActive = useRef(false);

  /**
   * 온보딩을 마친 뒤 갈 곳. 튜토리얼을 아직 안 봤으면 튜토리얼로 보낸다.
   *
   * tutorialShown은 온보딩으로 바뀌는 값이 아니라, 앱 진입 때 받아둔 캐시가
   * 그대로 유효하다. 캐시가 없으면 튜토리얼로 보낸다 — 온보딩을 막 마친
   * 사용자는 대개 신규라 그쪽이 맞고, 진입 마킹이 멱등이라 잘못 봐도 한 번 더
   * 뜨는 정도의 손해다.
   */
  const resolveDestination = useCallback((): Href => {
    const me = queryClient.getQueryData<MeResult>(QUERY_KEYS.me);
    return me?.tutorialShown ? '/home' : '/tutorial';
  }, [queryClient]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' || !shouldRecheckPermissionOnActive.current) {
        return;
      }

      shouldRecheckPermissionOnActive.current = false;

      void (async () => {
        const permission = await getIosNotificationPermissionStatus();
        if (permission && hasGrantedIosNotificationPermission(permission)) {
          router.replace(resolveDestination());
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [router, resolveDestination]);

  const complete = async () => {
    if (Platform.OS !== 'ios') {
      // Android 알림 권한은 로그인 시점(useEnableNotifications)에 이미 요청한다.
      router.replace(resolveDestination());
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
            onPress: () => router.replace(resolveDestination()),
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

    router.replace(resolveDestination());
  };

  return { complete };
}
