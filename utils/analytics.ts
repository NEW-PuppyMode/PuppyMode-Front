import analytics from '@react-native-firebase/analytics';

export const logScreenView = (screenName: string) =>
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });

export const logButtonTap = (
  buttonName: string,
  extra?: Record<string, unknown>,
) => analytics().logEvent('button_tap', { button_name: buttonName, ...extra });
