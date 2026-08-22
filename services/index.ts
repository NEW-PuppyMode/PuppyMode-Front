import { KEYS } from '@/constants/storage';
import { describeToken, logAuthEvent } from '@/utils/tokenDebug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

const mockActivate = process.env.EXPO_PUBLIC_MOCK_ACTIVATE?.trim();
const baseURL =
  (
    mockActivate === 'enable'
      ? process.env.EXPO_PUBLIC_MOCK_API_URL
      : process.env.EXPO_PUBLIC_API_URL
  )?.trim();

if (!baseURL) {
  console.warn('[API] baseURL is empty. Check EXPO_PUBLIC_API_URL.');
}

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

reissueInstance.interceptors.request.use((config) => {
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  console.log('[REISSUE REQ]', config.method?.toUpperCase(), url);
  return config;
});

reissueInstance.interceptors.response.use(
  (res) => {
    const url = `${res.config.baseURL ?? ''}${res.config.url ?? ''}`;
    console.log('[REISSUE RES]', res.status, url, res.data);
    return res;
  },
  (error: AxiosError) => {
    const url = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
    console.log('[REISSUE ERR]', error.response?.status, url, error.response?.data);
    return Promise.reject(error);
  },
);

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

/**
 * 토큰 삭제 = 강제 로그아웃. 모든 로그아웃에 원인을 남기기 위해 reason을 받는다.
 */
async function clearTokens(
  reason: string,
  extra?: Record<string, unknown>,
) {
  const [access, refresh] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  logAuthEvent('tokens:cleared', {
    reason,
    access: describeToken(access),
    refresh: describeToken(refresh),
    ...extra,
  });

  await AsyncStorage.multiRemove([
    KEYS.ACCESS_TOKEN,
    KEYS.REFRESH_TOKEN,
    KEYS.PROVIDER,
  ]);
}

// 중복 재발급 방지용
let refreshPromise: Promise<string> | null = null;

export async function reissueAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      logAuthEvent('reissue:no-refresh-token');
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const accessToken = await getAccessToken();

    // 보내는 refresh가 이미 만료됐는지 / 살아있는데 서버가 거부하는지 구분하기 위함
    logAuthEvent('reissue:request', {
      refresh: describeToken(refreshToken),
      access: describeToken(accessToken),
    });

    const response = await reissueInstance.post(
      '/auth/reissue',
      { refreshToken },
      accessToken
        ? { headers: { [KEYS.AUTH_HEADER_KEY]: `Bearer ${accessToken}` } }
        : undefined,
    );

    const data = response.data;

    if (!data?.isSuccess) {
      logAuthEvent('reissue:not-success', {
        code: data?.code,
        message: data?.message,
      });
      throw new Error(data?.message || '토큰 재발급 실패');
    }

    const newAccessToken = data.result.accessToken;
    const newRefreshToken = data.result.refreshToken;

    if (!newAccessToken) {
      logAuthEvent('reissue:missing-access-token', {
        resultKeys: Object.keys(data.result ?? {}),
      });
      throw new Error('새 access token이 없습니다.');
    }

    // rotation 증명: refresh fp가 바뀌고 exp가 다시 +14일로 리셋되는지
    logAuthEvent('reissue:success', {
      rotated: !!newRefreshToken && newRefreshToken !== refreshToken,
      newRefreshReceived: !!newRefreshToken,
      oldRefresh: describeToken(refreshToken),
      newRefresh: describeToken(newRefreshToken),
      newAccess: describeToken(newAccessToken),
      expiresIn: data.result.expiresIn,
    });

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
    // /auth/me는 index.tsx의 resolveAuthState()에서 직접 reissue 처리
    const isAuthRoute =
      requestUrl.includes('/auth/me') ||
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
        // refresh token이 실제로 만료/무효일 때만 토큰 삭제
        const reissueStatus = axios.isAxiosError(reissueError)
          ? reissueError.response?.status
          : null;

        // 서버 code가 AUTH_REFRESH_TOKEN_INVALID면 Redis 소실/TTL 만료가 확정된다
        logAuthEvent('reissue:failed', {
          triggeredBy: requestUrl,
          status: reissueStatus,
          body: axios.isAxiosError(reissueError)
            ? reissueError.response?.data
            : String(reissueError),
          willClearTokens: reissueStatus === 401 || reissueStatus === 403,
        });

        if (reissueStatus === 401 || reissueStatus === 403) {
          await clearTokens('reissue-rejected', { status: reissueStatus });
        }
        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);
