import * as amplitude from '@amplitude/analytics-react-native';
import analytics from '@react-native-firebase/analytics';

// Firebase와 Amplitude에 같은 이벤트를 함께 전송
export const logScreenView = (screenName: string) => {
  amplitude.trackScreenView(screenName);
  return analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const logButtonTap = (
  buttonName: string,
  extra?: Record<string, unknown>,
) => {
  const params = { button_name: buttonName, ...extra };
  amplitude.track('button_tap', params);
  return analytics().logEvent('button_tap', params);
};
