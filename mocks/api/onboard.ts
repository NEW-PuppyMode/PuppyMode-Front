// mocks/onboardHandlers.ts
import { delay, http, HttpResponse } from 'msw';

export const onboardHandlers = [
  http.post('*/api/onboarding/test', async ({ request }) => {
    const body = await request.json();
    console.log('받은 요청 바디:', body);

    await delay(400);

    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: '온보딩 테스트 성공',
      result: {
        type: '분위기 리더형',
        puppyBreed: '비숑 프리제',
        puppyBreedEng: 'Bichon Frisé',
        description:
          '사람들과 어울리는 것을 좋아하고 에너지를 주도하는 성격입니다.',
        imageUrl: '',
      },
    });
  }),
];
