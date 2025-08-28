import { useColorScheme } from '@/hooks/useColorScheme';
import theme from '@/styles/theme';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    pretendard: require('../assets/fonts/PretendardVariable.ttf'),
  });

  const [mockReady, setMockReady] = useState(false);

  useEffect(() => {
    async function enableMocking() {
      if (!__DEV__) {
        setMockReady(true);
        return;
      }

      await import('../msw.polyfills');
      const { server } = await import('../mocks/server');
      server.listen({ onUnhandledRequest: 'bypass' });
      console.log('[MSW] server.listen(native) ON');
      setMockReady(true);
    }

    enableMocking();
  }, []);

  if (!loaded || !mockReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <EmotionThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen
            name='index'
            options={{ title: '홈', headerShown: false }}
          />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='signin' options={{ headerShown: false }} />
          <Stack.Screen name='test/start' options={{ headerShown: false }} />
          <Stack.Screen
            name='test/proceeding'
            options={{ headerShown: false }}
          />
          <Stack.Screen name='test/result' options={{ headerShown: false }} />
          <Stack.Screen name='report' options={{ headerShown: false }} />
          <Stack.Screen name='setting' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
      </EmotionThemeProvider>
    </ThemeProvider>
  );
}
