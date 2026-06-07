import { KEYS } from '@/constants/storage';
import { fcmAPI } from '@/services/fcm';
import { notificationAPI } from '@/services/notification';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert, AppState, Linking } from 'react-native';

async function registerFcmTokenAndEnableNotification(): Promise<void> {
  const token = await messaging().getToken();
  await fcmAPI.registerToken(token);
  await notificationAPI.updateSettings(true);
}

export async function requestPermissionAndRegisterFcmToken(): Promise<void> {
  try {
    const settings = await notifee.requestPermission();
    const enabled =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert(
        '알림 권한 필요',
        '푸시 알림을 받으려면 기기 설정에서 알림을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정 열기',
            onPress: () => {
              Linking.openSettings();
              const subscription = AppState.addEventListener(
                'change',
                async (nextState) => {
                  if (nextState === 'active') {
                    subscription.remove();
                    const newSettings = await notifee.getNotificationSettings();
                    const nowGranted =
                      newSettings.authorizationStatus ===
                      AuthorizationStatus.AUTHORIZED;
                    if (nowGranted) {
                      await registerFcmTokenAndEnableNotification();
                    }
                  }
                },
              );
            },
          },
        ],
      );
      return;
    }

    await registerFcmTokenAndEnableNotification();
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

export async function displayLocalNotification(
  title: string,
  body: string,
): Promise<void> {
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
