import { init, Types } from '@amplitude/analytics-react-native';

// 개발 빌드는 Development, 릴리즈 빌드는 Production 프로젝트로 전송
const API_KEY = __DEV__
  ? process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY_DEV
  : process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY_PROD;

let initialized = false;

export const initAmplitude = () => {
  if (initialized) return;

  if (!API_KEY) {
    if (__DEV__) console.warn('[Amplitude] API Key가 없어 초기화를 건너뜀');
    return;
  }

  init(API_KEY, undefined, {
    // Debug/Verbose는 이벤트마다 Timeline 단계별 JSON을 쏟아내 다른 로그를 덮는다.
    // 그 JSON은 Amplitude로 보내는 페이로드 그 자체라 라이브 이벤트에서 그대로
    // 볼 수 있고, 전송 실패는 Warn/Error로 올라오므로 문제 추적에도 지장이 없다.
    // 계측을 새로 붙이며 흐름을 눈으로 좇아야 할 때만 잠깐 Debug로 올린다.
    logLevel: Types.LogLevel.Warn,
  });
  initialized = true;
};
