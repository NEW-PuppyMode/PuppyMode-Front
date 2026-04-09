import { KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

const baseURL =
  process.env.MOCK_ACTIVATE === 'enable'
    ? process.env.EXPO_PUBLIC_MOCK_API_URL
    : process.env.EXPO_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

const reissueInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  } catch (e) {
    console.error('AsyncStorage에서 access token 조회 실패', e);
    return null;
  }
}

async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  } catch (e) {
    console.error('AsyncStorage에서 refresh token 조회 실패', e);
    return null;
  }
}

function attachAccessToken(
  config: InternalAxiosRequestConfig,
  token: string,
): InternalAxiosRequestConfig {
  config.headers = (config.headers ?? {}) as AxiosRequestHeaders;
  config.headers[KEYS.AUTH_HEADER_KEY] = `Bearer ${token}`;
  return config;
}

async function saveTokens(accessToken: string, refreshToken?: string) {
  const items: [string, string][] = [[KEYS.ACCESS_TOKEN, accessToken]];

  if (refreshToken) {
    items.push([KEYS.REFRESH_TOKEN, refreshToken]);
  }

  await AsyncStorage.multiSet(items);
}

async function clearTokens() {
  await AsyncStorage.multiRemove([
    KEYS.ACCESS_TOKEN,
    KEYS.REFRESH_TOKEN,
    KEYS.PROVIDER,
  ]);
}

// 중복 재발급 방지용
let refreshPromise: Promise<string> | null = null;

async function reissueAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const response = await reissueInstance.post('/auth/reissue', {
      refreshToken,
    });

    const data = response.data;

    if (!data?.isSuccess) {
      throw new Error(data?.message || '토큰 재발급 실패');
    }

    const newAccessToken = data.result.accessToken;
    const newRefreshToken = data.result.refreshToken;

    if (!newAccessToken) {
      throw new Error('새 access token이 없습니다.');
    }

    await saveTokens(newAccessToken, newRefreshToken);

    return newAccessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
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

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? '';

    // 재발급 API나 로그인 API 자체는 재시도 대상에서 제외
    const isAuthRoute =
      requestUrl.includes('/auth/reissue') ||
      requestUrl.includes('/auth/kakao/login') ||
      requestUrl.includes('/auth/apple/login') ||
      requestUrl.includes('/auth/logout');

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await reissueAccessToken();

        originalRequest.headers = (originalRequest.headers ??
          {}) as AxiosRequestHeaders;
        originalRequest.headers[KEYS.AUTH_HEADER_KEY] =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        await clearTokens();
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);
