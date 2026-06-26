import { KEYS } from '@/constants/storage';
import { fcmAPI } from '@/services/fcm';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function deleteFcmToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    await fcmAPI.deleteToken(token);
  } catch (e) {
    console.error('FCM 토큰 삭제 실패:', e);
  }
}

export const DEFAULT_CHANNEL_ID = 'default';

export async function createDefaultChannel(): Promise<string> {
  return notifee.createChannel({
    id: DEFAULT_CHANNEL_ID,
    name: '기본 알림',
    importance: AndroidImportance.HIGH,
  });
}

export async function displayLocalNotification(
  title: string,
  body: string,
): Promise<void> {
  try {
    const channelId = await createDefaultChannel();
    await notifee.displayNotification({ title, body, android: { channelId } });
  } catch (e) {
    console.error('로컬 알림 표시 실패:', e);
  }
}

export function setupForegroundNotificationHandler(): () => void {
  return messaging().onMessage(async (remoteMessage) => {
    const title = remoteMessage.notification?.title ?? '알림';
    const body = remoteMessage.notification?.body ?? '';
    await displayLocalNotification(title, body);
  });
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
