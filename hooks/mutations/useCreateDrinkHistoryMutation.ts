import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { DrinkHistoryDTO } from '@/types/models/puppy';
import { logEvent } from '@/utils/analytics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * source·recordDay는 분석용이라 서버로 보내지 않는다.
 *
 * drinkDate만 보고 오늘/어제를 되짚으면 자정을 넘긴 경우에 어긋난다. 어느 버튼을
 * 눌렀는지는 호출부만 아는 사실이라 그대로 받는다. 필수 필드로 두면 기록 화면이
 * 하나 더 생겨도 컴파일이 계측을 강제한다.
 */
type CreateDrinkHistoryInput = DrinkHistoryDTO & {
  source: 'tutorial' | 'home';
  recordDay: 'today' | 'yesterday';
};

export const useCreateDrinkHistoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // 서버 스펙(DrinkHistoryDTO)에 있는 필드만 보낸다.
    mutationFn: (input: CreateDrinkHistoryInput) =>
      PuppyDataAPI.createDrinkHistory({
        drinkDate: input.drinkDate,
        isDrink: input.isDrink,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.isRecorded });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['report'] });

      logEvent('drink_record_created', {
        drank: variables.isDrink,
        source: variables.source,
        record_day: variables.recordDay,
      });
    },
  });
};
