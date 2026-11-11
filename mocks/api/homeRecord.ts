import type {
  DrinkHistoryDTO,
  IPuppyInfo,
  IsRecorded,
} from '@/types/models/puppy';
import { delay, http, HttpResponse } from 'msw';

/**
 * 홈 음주 기록 시나리오: 홈에서 음주 기록을 할 때마다 레벨이 1씩 올라,
 * 기록 리액션(화남/하트)·레벨업 배지·외형 변화 연출을 반복해서 볼 수 있다.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=homeRecord (mocks/handlers.ts 참고)
 *
 * - 기록은 진짜 서버로 보내지 않는다. (계정에 테스트 기록이 쌓이지 않음)
 * - 기록 여부는 항상 '오늘/어제 미기록'이라 몇 번이든 다시 기록할 수 있다.
 * - 레벨은 메모리에만 있어서 JS를 다시 불러오면(Metro에서 r) START_LEVEL로 돌아간다.
 */

// 시작 레벨. 9 → 첫 기록에 10(외형 변화), 19 → 20(외형 변화). 그 외엔 배지만 나온다.
const START_LEVEL = 9;
// 견종: 이 글자가 들어가면 해당 견종 (비숑 / 푸들 / 시바 / 코기). utils/dogMapper.ts의 getBreedKey 참고
const PUPPY_LEVEL_NAME = '비숑';

let level = START_LEVEL;

export const homeRecordHandlers = [
  http.get('*/main', async () => {
    await delay(300);
    const result: IPuppyInfo = {
      puppyLevel: level,
      puppyLevelName: PUPPY_LEVEL_NAME,
      puppyLevelPercent: 40,
      puppyImageUrl: '',
      didRecordYesterday: false,
      didRecordToday: false,
      isPuppyName: true,
      isMyName: true,
      isGoal: true,
      currentPuppyName: '멍뭉이',
      isOnboarded: true,
    };
    console.log('[MSW] /main → level:', level);
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result,
    });
  }),

  http.get('*/drink-history/status', async () => {
    await delay(200);
    const result: IsRecorded = {
      yesterdayRecorded: false,
      todayRecorded: false,
    };
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result,
    });
  }),

  // 기록할 때마다 레벨 +1 → 홈이 /main을 다시 받으며 레벨업을 감지한다.
  http.post('*/drink-history', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as DrinkHistoryDTO;
    level += 1;
    console.log(
      '[MSW] POST /drink-history →',
      body.drinkDate,
      body.isDrink ? '마심' : '안 마심',
      `/ level ${level - 1} → ${level}`,
    );
    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result: {},
    });
  }),
];
