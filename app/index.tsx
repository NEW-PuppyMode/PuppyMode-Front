import { KEYS } from '@/constants/storage';
import { useMeQuery } from '@/hooks/queries/useMeQuery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function Index() {
  const [hasTokens, setHasTokens] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]).then(
      ([[, access], [, refresh]]) => {
        setHasTokens(!!(access || refresh));
      },
    );
  }, []);

  const { data, isError, isPending } = useMeQuery(hasTokens === true);

  useEffect(() => {
    if (isError) {
      AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN, KEYS.PROVIDER]);
    }
  }, [isError]);

  if (hasTokens === null || (hasTokens && isPending)) return null;

  if (isError || hasTokens === false) return <Redirect href='/signin' />;

  if (data?.isOnboarded) return <Redirect href='/home' />;
  return <Redirect href='/test/start' />;
}
