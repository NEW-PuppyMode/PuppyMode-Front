import { notificationAPI } from '@/services/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useNotificationSettingQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notificationSetting,
    queryFn: notificationAPI.getSettings,
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
      const previous = queryClient.getQueryData(QUERY_KEYS.notificationSetting);
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, {
        receiveNotifications: newValue,
      });
      return { previous };
    },
    onError: (_err, _newValue, context) => {
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, context?.previous);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.notificationSetting, data);
    },
  });
};
