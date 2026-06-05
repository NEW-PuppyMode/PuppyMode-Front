import { KEYS } from '@/constants/storage';
import { fcmAPI } from '@/services/fcm';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function requestPermissionAndRegisterFcmToken(): Promise<void> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;

    const token = await messaging().getToken();
    console.log('[FCM Token]', token); // TODO: 임시 확인용 로그, 추후 제거
    await fcmAPI.registerToken(token);
  } catch (e) {
    console.error('FCM 권한 요청 및 토큰 등록 실패:', e);
  }
}

export async function deleteFcmToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    await fcmAPI.deleteToken(token);
  } catch (e) {
    console.error('FCM 토큰 삭제 실패:', e);
  }
}

export async function displayLocalNotification(title: string, body: string): Promise<void> {
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: '기본 알림',
      importance: AndroidImportance.HIGH,
    });
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
