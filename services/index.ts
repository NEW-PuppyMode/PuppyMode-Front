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
});

async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  } catch (e) {
    console.error('토큰 조회 실패', e);
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

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       originalRequest.url !== '/auth/refresh'
//     ) {
//       console.log('accessToken이 만료되었습니다.');
//       originalRequest._retry = true;

//       try {
//         const newAccessToken = await loginAPI.refresh();

//         if (typeof window !== 'undefined') {
//           Cookies.set(KEYS.ACCESS_TOKEN, newAccessToken, {
//             path: '/',
//             sameSite: 'lax',
//             // secure: true, // HTTPS사용 시 활성화 권장
//             // expires: 7 // 필요 시 만료 기간 설정
//           });
//           localStorage.setItem(KEYS.ACCESS_TOKEN, newAccessToken);
//         }
//         return axiosInstance(
//           attachAccessToken(originalRequest, newAccessToken),
//         );
//       } catch (refreshError) {
//         console.error('Refresh Token 실패', refreshError);
//         if (typeof window !== 'undefined') {
//           // Cookies.remove(KEYS.ACCESS_TOKEN, { path: '/' });
//           window.location.href = '/';
//         }
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   },
// );
