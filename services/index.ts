import { KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL =
  process.env.MOCK_ACTIVATE === 'enable'
    ? process.env.EXPO_PUBLIC_MOCK_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
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

/** REQUEST */
axiosInstance.interceptors.request.use(
  async (config) => {
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.log('[REQ]', config.method?.toUpperCase(), url);

    const token = await getAccessToken();
    return token ? attachAccessToken(config, token) : config;
  },
  (error) => Promise.reject(error),
);

/** RESPONSE */
axiosInstance.interceptors.response.use(
  (res) => {
    const url = `${res.config.baseURL ?? ''}${res.config.url ?? ''}`;
    console.log('[RES]', res.status, url);
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;

    console.log('[ERR]', status, url);
    console.log('[ERR DATA]', error.response?.data);

    // 여기서 나중에 401 refresh 로직 넣기 좋음
    return Promise.reject(error);
  },
);
