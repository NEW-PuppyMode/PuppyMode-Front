import { KEYS } from '@/constants/storage';
import { useNotificationSettingQuery } from '@/hooks/queries/useNotificationSettingQuery';
import { useRecentGoalQuery } from '@/hooks/queries/useRecentGoalQuery';
import { setUserProps, type LoginProvider } from '@/utils/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * 사용자 속성을 앱 실행마다 다시 세팅한다.
 *
 * 값이 서로 다른 시점에 준비되므로(로컬 저장소 / 서버 응답 / OS 권한) 한 번에
 * 모아서 보내지 않고, 준비되는 대로 각자 setUserProps를 부른다. setUserProps는
 * 넘긴 키만 덮으므로 나눠 보내도 서로 지우지 않는다.
 *
 * 서버 값(목표·알림 수신)은 캐시를 구독하는 형태라, 앱을 쓰는 도중 값이 바뀌면
 * (목표 갱신, 알림 토글) 그때도 자동으로 다시 세팅된다.
 */
export function useAnalyticsUserProps() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 로그인 여부는 토큰 유무로 직접 판정한다.
   *
   * 전에는 useMeQuery(false)로 쿼리 캐시를 구독했는데, 로그아웃의
   * queryClient.clear()가 Query 객체를 파괴하면 이 옵저버가 거기 묶인 채
   * 남았다. 옵저버가 새 Query에 다시 붙는 건 리렌더(setOptions)나 fetch
   * 시점뿐인데, 비활성 쿼리는 fetch를 안 하고 리렌더시킬 값도 이 게이트
   * 뒤에 막혀 있어서, 재로그인해도 영영 false로 남는 교착이 있었다.
   *
   * 화면 이동마다 다시 읽는다. 로그인 직후에도 로그아웃 직후에도 앱은 반드시
   * 이동하므로 양쪽 다 잡힌다.
   */
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
      if (!cancelled) setIsLoggedIn(!!token);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const { data: recentGoal } = useRecentGoalQuery(isLoggedIn);
  const { data: notificationSetting } = useNotificationSettingQuery(isLoggedIn);

  // ===== 로컬에 저장해둔 값 (강아지 유형 / 로그인 수단) =====
  useEffect(() => {
    if (!isLoggedIn) return;

    void (async () => {
      const [[, dogType], [, provider]] = await AsyncStorage.multiGet([
        KEYS.DOG_TYPE,
        KEYS.PROVIDER,
      ]);

      setUserProps({
        // 유형 검사를 이 기기에서 치른 적이 없으면 값이 없다. 서버 응답에 유형
        // 코드가 추가되기 전까지 기존 사용자는 이 속성이 비어 있다.
        dog_type: dogType ?? undefined,
        login_provider: (provider as LoginProvider | null) ?? undefined,
      });
    })();
  }, [isLoggedIn]);

  // ===== OS 알림 권한 =====
  // 설정 화면에서 나가 OS 설정을 바꾸고 돌아올 수 있으므로 포그라운드 복귀 때도 다시 읽는다.
  const syncPermission = useCallback(() => {
    if (!isLoggedIn) return;

    void (async () => {
      const status = await messaging().hasPermission();
      setUserProps({
        notification_permission:
          status === messaging.AuthorizationStatus.AUTHORIZED ||
          status === messaging.AuthorizationStatus.PROVISIONAL,
      });
    })();
  }, [isLoggedIn]);

  useEffect(() => {
    syncPermission();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') syncPermission();
    });
    return () => subscription.remove();
  }, [syncPermission]);

  // ===== 서버 값 =====
  const monthlyGoal = recentGoal?.monthlyGoalCount;
  useEffect(() => {
    if (monthlyGoal === undefined) return;
    setUserProps({ current_monthly_goal: monthlyGoal });
  }, [monthlyGoal]);

  const receiveNotifications = notificationSetting?.receiveNotifications;
  useEffect(() => {
    if (receiveNotifications === undefined) return;
    setUserProps({ notification_setting: receiveNotifications });
  }, [receiveNotifications]);

  // 어떤 속성이 언제 세팅되는지 눈으로 확인하기 위한 임시 로그.
  // 3단계 검증이 끝나면 지워도 된다.
  useEffect(() => {
    if (!__DEV__) return;
    console.log('[Analytics] 게이트', {
      pathname,
      isLoggedIn,
      monthlyGoal,
      receiveNotifications,
    });
  }, [pathname, isLoggedIn, monthlyGoal, receiveNotifications]);
}
