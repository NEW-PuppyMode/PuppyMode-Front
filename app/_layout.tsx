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
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <EmotionThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='signin' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' />
        </Stack>

        <StatusBar style='auto' />
      </EmotionThemeProvider>
    </ThemeProvider>
  );
}
