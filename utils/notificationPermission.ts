import { KEYS } from '@/constants/storage';
import { logEvent } from '@/utils/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const IOS_GRANTED_STATUSES = [
  Notifications.IosAuthorizationStatus.AUTHORIZED,
  Notifications.IosAuthorizationStatus.PROVISIONAL,
  Notifications.IosAuthorizationStatus.EPHEMERAL,
];

export function hasGrantedIosNotificationPermission(
  settings: Notifications.NotificationPermissionsStatus,
) {
  return (
    settings.granted ||
    IOS_GRANTED_STATUSES.includes(
      settings.ios?.status ?? Notifications.IosAuthorizationStatus.DENIED,
    )
  );
}

export async function getIosNotificationPermissionStatus() {
  if (Platform.OS !== 'ios') {
    return null;
  }

  return Notifications.getPermissionsAsync();
}

export async function requestIosNotificationPermission() {
  if (Platform.OS !== 'ios') {
    return true;
  }

  const currentSettings = await Notifications.getPermissionsAsync();
  if (hasGrantedIosNotificationPermission(currentSettings)) {
    return true;
  }

  const nextSettings = currentSettings.canAskAgain
    ? await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      })
    : currentSettings;

  return hasGrantedIosNotificationPermission(nextSettings);
}

/**
 * OS 권한 팝업의 응답을 이 설치에서 한 번만 남긴다.
 *
 * 팝업은 "아직 묻지 않은" 상태에서만 뜨는데, 그 상태를 두 플랫폼에서 같은 방식으로
 * 읽어낼 수가 없다. iOS는 NOT_DETERMINED가 따로 있지만 Android는 "거부"와 "아직
 * 안 물어봄"이 둘 다 DENIED로 온다. 그래서 우리가 물어봤는지를 직접 기록한다.
 *
 * 이 가드가 없으면 로그인할 때마다 requestAndEnable이 불려서, 팝업이 뜨지도 않았는데
 * "권한에 응답했다"가 매번 찍힌다.
 */
export async function logNotificationPermissionResponse(granted: boolean) {
  const asked = await AsyncStorage.getItem(KEYS.NOTIF_PERMISSION_ASKED);
  if (asked) return;

  await AsyncStorage.setItem(KEYS.NOTIF_PERMISSION_ASKED, '1');
  logEvent('notification_permission_responded', { granted });
}
