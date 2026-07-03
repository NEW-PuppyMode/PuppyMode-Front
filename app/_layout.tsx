import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AnalyticsRouteTracker } from '@/components/common/AnalyticsRouteTracker';
import { CrashlyticsRouteTracker } from '@/components/common/CrashlyticsRouteTracker';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import theme from '@/styles/theme';
import { createDefaultChannel, setupForegroundNotificationHandler, setupTokenRefreshListener } from '@/utils/fcm';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
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
  Text as RNText,
  TextInput as RNTextInput,
  type StyleProp,
  type TextStyle,
} from 'react-native';

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
