import { KEYS } from '@/constants/storage';
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
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    const response = await axiosInstance.post<KakaoLoginResponse>(
      '/auth/kakao/login',
      {
        accessToken,
        refreshToken,
      },
    );
    await AsyncStorage.setItem(
      KEYS.ACCESS_TOKEN,
      response.data.result.accessToken,
    );
    await AsyncStorage.setItem(KEYS.PROVIDER, 'kakao');

    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    console.log('response.data.result: ', response.data.result);
    return response.data.result;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.PROVIDER,
    ]);
  },

  me: async (): Promise<KakaoLoginResult['userInfo']> => {
    const response = await axiosInstance.get<KakaoLoginResponse>('/auth/me');
    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }
    return response.data.result.userInfo;
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

  // ✅ 카카오 소셜 회원 탈퇴
  withdrawKakao: async (): Promise<void> => {
    const response = await axiosInstance.post('/users/withdraw', {});
    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }
    console.log('탈퇴 성공:', response.data.message);
  },
};
