import { KEYS } from '@/constants/storage';
import { fcmAPI } from '@/services/fcm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function requestPermissionAndRegisterFcmToken(): Promise<void> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return;

  const token = await messaging().getToken();
  await fcmAPI.registerToken(token);
}

export async function deleteFcmToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    await fcmAPI.deleteToken(token);
  } catch (e) {
    console.error('FCM 토큰 삭제 실패:', e);
  }
}

export function setupTokenRefreshListener(): () => void {
  return messaging().onTokenRefresh(async (token) => {
    try {
      const accessToken = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
      if (!accessToken) return;
      await fcmAPI.registerToken(token);
    } catch (e) {
      console.error('FCM 토큰 갱신 등록 실패:', e);
    }
  });
}
