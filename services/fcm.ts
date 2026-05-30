import { axiosInstance } from '.';

export const fcmAPI = {
  registerToken: async (fcmToken: string): Promise<void> => {
    await axiosInstance.post('/fcm/tokens', { fcmToken });
  },

  deleteToken: async (fcmToken: string): Promise<void> => {
    await axiosInstance.delete('/fcm/tokens', { data: { fcmToken } });
  },
};
