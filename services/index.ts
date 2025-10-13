import { KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { InternalAxiosRequestConfig } from 'axios';

const baseUrl =
  process.env.MOCK_ACTIVATE === 'enable'
    ? process.env.EXPO_PUBLIC_MOCK_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000,
});

async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  } catch (e) {
    console.error('AsyncStorage에서 토큰 조회 실패', e);
    return null;
  }
}

function attachAccessToken(
  config: InternalAxiosRequestConfig,
  token: string,
): InternalAxiosRequestConfig {
  config.headers = config.headers ?? {};
  config.headers[KEYS.AUTH_HEADER_KEY] = `Bearer ${token}`;

  return config;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    return token ? attachAccessToken(config, token) : config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;

    // if (
    //   error.response?.status === 401 &&
    //   !originalRequest._retry
    //   // && originalRequest.url !== '/auth/refresh'
    // ) {
    //   originalRequest._retry = true;

    //   try {
    //     const { result: newAccessToken } = await loginAPI.refresh();

    //     await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, newAccessToken);
    //     return axiosInstance(
    //       attachAccessToken(originalRequest, newAccessToken),
    //     );
    //   } catch (refreshError) {
    //     await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    //     router.navigate('/');
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  },
);
