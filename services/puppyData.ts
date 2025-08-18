import { axiosInstance } from '.';

export const PuppyDataAPI = {
  renamePuppy: async (puppyName: string) => {
    const response = await axiosInstance.post('/puppy-name', {
      puppyName: puppyName,
    });
    return response.data;
  },

  renameUser: async (userName: string) => {
    const response = await axiosInstance.post('/my-name', {
      myName: userName,
    });
    return response.data;
  },

  advicePuppy: async () => {
    const response = await axiosInstance.get('/advice');
    return response.data;
  },
};
