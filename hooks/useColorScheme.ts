import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const scheme = useRNColorScheme();
  return scheme ?? 'light';
}
