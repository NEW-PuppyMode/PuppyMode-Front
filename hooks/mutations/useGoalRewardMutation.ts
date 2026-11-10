import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { ReportApi } from '@/services/reportData';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type GoalRewardInput = { year: number; month: number };

/**
 * 지난 달 목표 달성 보상(경험치) 요청. 목표 갱신 화면의 리포트 스텝에서 부른다.
 *
 * 서버가 여러 번 불러도 한 번만 지급하므로 실패하면 한 번 더 시도한다.
 * 지급되면 레벨·경험치가 바뀌므로 /main을 다시 받는다.
 */
export const useGoalRewardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ year, month }: GoalRewardInput) =>
      ReportApi.rewardGoal(year, month),
    retry: 1,
    onSuccess: (data) => {
      if (data.rewarded) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      }
    },
  });
};
