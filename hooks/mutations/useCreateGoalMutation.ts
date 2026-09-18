import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { GoalDTO } from '@/types/models/puppy';
import { setUserProps } from '@/utils/analytics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: GoalDTO) => PuppyDataAPI.createGoal(goal),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      // current_monthly_goal 사용자 속성이 이 쿼리에서 나온다. 여기서 무효화하지
      // 않으면 온보딩에서 목표를 저장해도 이전 값이 캐시에 남는다.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recentGoal });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goalMonths });
      queryClient.invalidateQueries({ queryKey: ['report'] });

      // recentGoal 리페치를 기다리면 GET /goals 왕복만큼 늦어, 온보딩에서는 이미
      // 튜토리얼로 넘어간 뒤에야 속성이 반영된다. 값은 응답에 있으니 바로 세팅한다.
      setUserProps({
        current_monthly_goal: data.result?.goal ?? variables.goal,
      });
    },
  });
};
