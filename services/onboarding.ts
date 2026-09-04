import { axiosInstance } from '.';

export interface TutorialStartResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

export const onboardingAPI = {
  /**
   * 튜토리얼 진행 상태를 '봤음'으로 등록한다.
   *
   * 서버가 "진입 시점"을 기준으로 정의한 API라 튜토리얼 화면이 처음 렌더될 때
   * 호출한다. 완료 시점이 아니다. 이미 등록된 상태에서 다시 호출해도 200이므로
   * 중복 호출을 두려워할 필요는 없다.
   */
  startTutorial: async (): Promise<TutorialStartResponse> => {
    const response = await axiosInstance.post<TutorialStartResponse>(
      '/onboarding/tutorial/start',
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    return response.data;
  },
};
