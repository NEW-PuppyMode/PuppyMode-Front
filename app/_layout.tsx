import { AnalyticsRouteTracker } from '@/components/common/AnalyticsRouteTracker';
import { AnalyticsUserPropsTracker } from '@/components/common/AnalyticsUserPropsTracker';
import { CrashlyticsRouteTracker } from '@/components/common/CrashlyticsRouteTracker';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import theme from '@/styles/theme';
import { initAmplitude } from '@/utils/amplitude';
import {
  createDefaultChannel,
  setupForegroundNotificationHandler,
  setupTokenRefreshListener,
} from '@/utils/fcm';
import { holdSplash } from '@/utils/splash';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Platform,
  Text as RNText,
  TextInput as RNTextInput,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

// 자식 컴포넌트의 이벤트보다 먼저 초기화되도록 렌더 전에 한 번만 호출
initAmplitude();

// 첫 화면이 준비될 때까지 스플래시를 유지한다. 내리는 곳은 utils/splash.ts 참고
holdSplash();

function setGlobalFontFamily(fontFamily: string) {
  const TextComp = RNText as unknown as {
    defaultProps?: { style?: StyleProp<TextStyle> };
  };
  TextComp.defaultProps = {
    ...(TextComp.defaultProps || {}),
    style: [TextComp.defaultProps?.style, { fontFamily }],
  };

  const TextInputComp = RNTextInput as unknown as {
    defaultProps?: { style?: StyleProp<TextStyle> };
  };
  TextInputComp.defaultProps = {
    ...(TextInputComp.defaultProps || {}),
    style: [TextInputComp.defaultProps?.style, { fontFamily }],
  };
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    pretendard: require('../assets/fonts/PretendardVariable.ttf'),
  });
  const [mockReady, setMockReady] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  // useEffect(() => {
  //   crashlytics().log('App started');
  // }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (loaded) setGlobalFontFamily('pretendard');

      const mockEnabled =
        __DEV__ && process.env.EXPO_PUBLIC_MOCK_ACTIVATE === 'enable';

      if (mockEnabled) {
        await import('../msw.polyfills');
        const { server } = await import('../mocks/server');
        try {
          server.listen({ onUnhandledRequest: 'bypass' });
          console.log('[MSW] server.listen(native) ON');
        } catch (e) {
          // StrictMode에서 중복 listen 등 방어
          console.log('[MSW] listen skipped', e);
        }
      }

      if (!cancelled) setMockReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [loaded]);

  const ready = loaded && mockReady;

  useEffect(() => {
    // 개발 빌드에서는 Analytics 이벤트 수집을 비활성화해 노이즈 데이터 차단
    analytics()
      .setAnalyticsCollectionEnabled(!__DEV__)
      .catch((e) => console.log('[Analytics] setCollectionEnabled failed', e));
  }, []);

  useEffect(() => {
    // firebase.json의 crashlytics_debug_enabled는 iOS에도 적용되는데, iOS는 아직
    // 개발용 Firebase로 분리되지 않아 디버그 빌드 에러가 운영으로 간다. 그래서 iOS 디버그만 끈다.
    // 이 값은 기기에 저장되어 앱을 덮어 설치해도 남으므로 릴리즈에서도 매번 명시한다.
    // TODO: iOS도 개발용 Firebase로 분리하면 이 effect를 지운다.
    const isIosDebug = __DEV__ && Platform.OS === 'ios';
    crashlytics()
      .setCrashlyticsCollectionEnabled(!isIosDebug)
      .catch((e) =>
        console.log('[Crashlytics] setCollectionEnabled failed', e),
      );

    // 꺼져 있는 동안 쌓인 리포트가 나중에 릴리즈 빌드에서 운영으로 올라가지 않게 지운다
    if (isIosDebug) {
      crashlytics()
        .deleteUnsentReports()
        .catch((e) =>
          console.log('[Crashlytics] deleteUnsentReports failed', e),
        );
    }
  }, []);

  useEffect(() => {
    const unsubscribe = setupTokenRefreshListener();
    return unsubscribe;
  }, []);

  useEffect(() => {
    createDefaultChannel().catch((e) =>
      console.error('기본 알림 채널 생성 실패:', e),
    );
  }, []);

  useEffect(() => {
    const unsubscribe = setupForegroundNotificationHandler();
    return unsubscribe;
  }, []);

  useEffect(() => {
    crashlytics().setAttribute('ready', ready ? '1' : '0');
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      crashlytics().log(
        `RootLayout not ready (loaded=${loaded ? 1 : 0}, mockReady=${mockReady ? 1 : 0})`,
      );
    }
  }, [ready, loaded, mockReady]);

  if (!ready) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <EmotionThemeProvider theme={theme}>
          <StatusBar style='auto' />
        </EmotionThemeProvider>
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <EmotionThemeProvider theme={theme}>
            <ErrorBoundary>
              <AnalyticsRouteTracker />
              <AnalyticsUserPropsTracker />
              <CrashlyticsRouteTracker />
              <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='signin' options={{ headerShown: false }} />
                <Stack.Screen
                  name='home'
                  options={{ title: '홈', headerShown: false }}
                />
                <Stack.Screen
                  name='test/start'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='test/proceeding'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='test/result'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='onboarding/index'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='goal/index'
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='tutorial'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='report' options={{ headerShown: false }} />
                <Stack.Screen
                  name='calendar'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='setting' options={{ headerShown: false }} />
                <Stack.Screen
                  name='delete_account'
                  options={{ headerShown: false }}
                />
                <Stack.Screen name='+not-found' />
              </Stack>
              <StatusBar style='auto' />
            </ErrorBoundary>
          </EmotionThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
