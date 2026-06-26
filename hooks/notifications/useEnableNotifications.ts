import { useUpdateNotificationSettingMutation } from '@/hooks/queries/useNotificationSettingQuery';
import { fcmAPI } from '@/services/fcm';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import { Alert, AppState, Linking } from 'react-native';

export const useEnableNotifications = () => {
  const { mutateAsync: updateNotificationSetting } =
    useUpdateNotificationSettingMutation();

  const registerTokenAndEnable = useCallback(async () => {
    const token = await messaging().getToken();
    await fcmAPI.registerToken(token);
    await updateNotificationSetting(true);
  }, [updateNotificationSetting]);

  const requestAndEnable = useCallback(async () => {
    try {
      const settings = await notifee.requestPermission();
      const enabled =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await registerTokenAndEnable();
        return;
      }

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
                      await registerTokenAndEnable();
                    }
                  }
                },
              );
            },
          },
        ],
      );
    } catch (e) {
      console.error('FCM 권한 요청 및 토큰 등록 실패:', e);
    }
  }, [registerTokenAndEnable]);

  return { requestAndEnable, registerTokenAndEnable };
};
