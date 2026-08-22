import { KEYS } from '@/constants/storage';
import { describeToken, logAuthEvent } from '@/utils/tokenDebug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '.';

export interface KakaoLoginResult {
  accessToken: string;
  refreshToken: string;
  userInfo: {
    username: string;
    isNewUser: boolean;
  };
}

export interface KakaoLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: KakaoLoginResult;
}

export interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isOnboarded: boolean;
  };
}

export interface WithdrawResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

export const loginAPI = {
  kakaoLogin: async (
    accessToken: string,
    refreshToken: string,
  ): Promise<KakaoLoginResult> => {
    const response = await axiosInstance.post<KakaoLoginResponse>(
      '/auth/kakao/login',
      {
        accessToken,
        refreshToken,
      },
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    // 기준선: 로그인 직후 refresh exp가 정말 +14일인지
    logAuthEvent('login:kakao', {
      access: describeToken(response.data.result.accessToken),
      refresh: describeToken(response.data.result.refreshToken),
    });

    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, response.data.result.accessToken],
      [KEYS.REFRESH_TOKEN, response.data.result.refreshToken],
      [KEYS.PROVIDER, 'kakao'],
    ]);

    return response.data.result;
  },

  me: async (): Promise<MeResponse> => {
    const response = await axiosInstance.get<MeResponse>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    // 사용자가 직접 로그아웃한 경우 — 비자발적 로그아웃과 구분하기 위한 표시
    logAuthEvent('logout:user-initiated');
    await axiosInstance.post('/auth/logout');
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.PROVIDER,
    ]);
  },

  withdrawApple: async (): Promise<WithdrawResponse> => {
    const response = await axiosInstance.delete<WithdrawResponse>(
      '/auth/apple/withdraw',
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  withdrawKakao: async (): Promise<void> => {
    const response = await axiosInstance.post('/users/withdraw', {});
    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }
    console.log('탈퇴 성공:', response.data.message);
  },
};
