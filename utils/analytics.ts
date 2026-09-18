import * as amplitude from '@amplitude/analytics-react-native';
import analytics from '@react-native-firebase/analytics';
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  AnalyticsUserProps,
} from './analyticsEvents';

export type {
  AnalyticsEventMap,
  AnalyticsEventName,
  AnalyticsUserProps,
  LoginProvider,
} from './analyticsEvents';

/**
 * 전송 실패가 화면 동작을 막지 않게 한다.
 * 호출부는 전부 이벤트 핸들러라 await 하지 않으므로, 여기서 삼키지 않으면
 * 처리되지 않은 rejection으로 남는다.
 */
const swallow = (label: string) => (e: unknown) => {
  if (__DEV__) console.log(`[Analytics] ${label} 실패`, e);
};

// Firebase와 Amplitude에 같은 이벤트를 함께 전송
export const logScreenView = (screenName: string) => {
  amplitude.trackScreenView(screenName);
  return analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
};

/**
 * 버튼 탭 = "시도".
 * 설계 이벤트(logEvent)는 "성공"만 남기므로, 둘을 함께 보면 시도 대비
 * 성공 전환율까지 볼 수 있다. 그래서 새 이벤트를 붙여도 이건 지우지 않는다.
 */
export const logButtonTap = (
  buttonName: string,
  extra?: Record<string, unknown>,
) => {
  const params = { button_name: buttonName, ...extra };
  amplitude.track('button_tap', params);
  return analytics().logEvent('button_tap', params);
};

/**
 * 설계 문서에 정의된 이벤트 전송.
 * 이름과 속성은 AnalyticsEventMap이 강제한다. 속성이 없는 이벤트는
 * 두 번째 인자 자체가 사라진다. (logEvent('logout'))
 */
export const logEvent = <K extends AnalyticsEventName>(
  ...[name, props]: AnalyticsEventMap[K] extends undefined
    ? [name: K]
    : [name: K, props: AnalyticsEventMap[K]]
): void => {
  const params = (props ?? undefined) as Record<string, unknown> | undefined;

  amplitude.track(name, params);
  analytics()
    .logEvent(name, params)
    .catch(swallow(`logEvent(${name})`));
};

/**
 * 사용자 속성 세팅. 주어진 키만 덮고 나머지는 그대로 둔다.
 * 값이 undefined인 키는 (아직 모르는 값이므로) 건너뛴다.
 */
export const setUserProps = (props: Partial<AnalyticsUserProps>): void => {
  const entries = Object.entries(props).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  if (entries.length === 0) return;

  const identify = new amplitude.Identify();
  entries.forEach(([key, value]) => {
    identify.set(key, value as string | number | boolean);
  });
  amplitude.identify(identify);

  // Firebase 사용자 속성은 문자열만 받는다.
  const firebaseProps = Object.fromEntries(
    entries.map(([key, value]) => [key, String(value)]),
  );
  analytics()
    .setUserProperties(firebaseProps)
    .catch(swallow('setUserProps'));
};

/**
 * 로그인한 사용자를 식별한다.
 *
 * 서버가 아직 사용자 식별자를 내려주지 않아 호출할 곳이 없다. /auth/me 또는
 * 로그인 응답에 id가 추가되면 로그인·부팅 시점에서 이 함수를 부르면 된다.
 * 그 전까지 Amplitude는 기기 단위로만 집계한다.
 */
export const setAnalyticsUserId = (userId: string): void => {
  amplitude.setUserId(userId);
  analytics().setUserId(userId).catch(swallow('setUserId'));
};

/**
 * 로그아웃·탈퇴 시 사용자 식별을 끊는다.
 * 이걸 하지 않으면 한 기기에서 계정을 바꿨을 때 다음 사용자의 이벤트가
 * 이전 사용자에게 붙고, 사용자 속성도 남아서 섞인다.
 */
export const resetAnalyticsUser = (): void => {
  // deviceId까지 새로 발급해 이전 사용자와 완전히 분리한다.
  amplitude.reset();
  analytics().setUserId(null).catch(swallow('resetUserId'));
};
