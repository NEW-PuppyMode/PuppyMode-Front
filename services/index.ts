import axios from 'axios';

export const axiosInstance = axios.create({
  adapter: 'fetch',
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const url = (config.baseURL || '') + (config.url || '');
  console.log('[AXIOS] →', url, 'params=', config.params);
  return config;
});
