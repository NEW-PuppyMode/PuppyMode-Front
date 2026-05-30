import { axiosInstance } from '.';

export interface NotificationSettingResult {
  receiveNotifications: boolean;
}

export const notificationAPI = {
  getSettings: async (): Promise<NotificationSettingResult> => {
    const response = await axiosInstance.get('/notification-settings');
    return response.data.result;
  },

  updateSettings: async (
    receiveNotifications: boolean,
  ): Promise<NotificationSettingResult> => {
    const response = await axiosInstance.patch('/notification-settings', {
      receiveNotifications,
    });
    return response.data.result;
  },
};
