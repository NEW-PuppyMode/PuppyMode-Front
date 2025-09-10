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

export const loginAPI = {
  kakaoLogin: async (
    accessToken: string,
    refreshToken: string,
  ): Promise<KakaoLoginResult> => {
    const response = await axiosInstance.get<KakaoLoginResponse>(
      '/auth/kakao/login',
      {
        params: {
          accessToken,
          refreshToken,
        },
      },
    );
    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    console.log(response.data.result);
    return response.data.result;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  me: async (): Promise<KakaoLoginResult['userInfo']> => {
    const response = await axiosInstance.get<KakaoLoginResponse>('/auth/me');
    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }
    return response.data.result.userInfo;
  },
};
