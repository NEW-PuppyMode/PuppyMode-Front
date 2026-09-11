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
    logLevel: __DEV__ ? Types.LogLevel.Debug : Types.LogLevel.Warn,
  });
  initialized = true;
};
