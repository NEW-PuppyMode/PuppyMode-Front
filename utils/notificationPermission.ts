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
