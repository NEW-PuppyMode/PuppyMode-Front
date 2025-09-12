import { axiosInstance } from '.';

export type TestAnswer = {
  questionId: number;
  answer: number; // 1 또는 2
};

export type TestSubmitResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    type: string;
    puppyBreed: string;
    description: string;
    imageUrl: string;
  };
};

export const TestApi = {
  submitTest: async (answers: TestAnswer[]) => {
    const res = await axiosInstance.post<TestSubmitResponse>(
      '/api/onboarding/test',
      {
        answers,
      },
    );

    console.log(answers);
    if (!res.data?.isSuccess) {
      throw new Error(res.data?.message || '검사 제출 실패');
    }
    return res.data; 
  },
};
