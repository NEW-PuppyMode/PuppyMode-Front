import { KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function Index() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
      console.log('맨처음 인덱스에서 token:', token);
      setHasToken(!!token);
    }

    checkToken();
  }, []);

  if (hasToken === null) {
    return null;
  }

  if (hasToken) {
    return <Redirect href='/home' />;
  }

  return <Redirect href='/signin' />;
}
