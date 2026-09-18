import {
  notificationAPI,
  type NotificationSettingResult,
} from '@/services/notification';
import { logEvent } from '@/utils/analytics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

// enabled는 로그인 전에 호출되지 않도록 막는 용도다. 기본값이 true라 기존 호출부는
// 그대로 동작한다.
export const useNotificationSettingQuery = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.notificationSetting,
    queryFn: notificationAPI.getSettings,
    enabled,
  });
};

export const useUpdateNotificationSettingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.updateSettings,
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.notificationSetting,
      });
      const previous = queryClient.getQueryData<NotificationSettingResult>(
        QUERY_KEYS.notificationSetting,
      );
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, {
        receiveNotifications: newValue,
      });
      return { previous };
    },
    onError: (_err, _newValue, context) => {
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, context?.previous);
    },
    onSuccess: (data, _newValue, context) => {
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, data);

      // 로그인할 때마다 registerTokenAndEnable이 true로 다시 저장하므로, 값이
      // 실제로 바뀐 경우에만 남긴다. 이전 값을 모르면 "변경"이라 할 수 없어 건너뛴다.
      const before = context?.previous?.receiveNotifications;
      if (before !== undefined && before !== data.receiveNotifications) {
        logEvent('notification_setting_changed', {
          enabled: data.receiveNotifications,
        });
      }
    },
  });
};
