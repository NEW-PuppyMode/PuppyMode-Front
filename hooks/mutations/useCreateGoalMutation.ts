import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { GoalDTO } from '@/types/models/puppy';
import { logEvent, setUserProps } from '@/utils/analytics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * entryPoint는 분석용이라 서버로 보내지 않는다.
 *
 * 목표 저장은 온보딩·갱신·홈 네 곳에서 일어나는데, 이벤트를 호출부마다 붙이면
 * 한 곳을 빠뜨리기 쉽다. 필수 필드로 두면 새 호출부가 생겨도 컴파일이 막아준다.
 */
type CreateGoalInput = GoalDTO & {
  entryPoint: 'onboarding' | 'renewal' | 'home';
};

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // entryPoint는 빼고 서버 스펙(GoalDTO)에 있는 필드만 보낸다.
    mutationFn: (input: CreateGoalInput) =>
      PuppyDataAPI.createGoal({ goal: input.goal, isNew: input.isNew }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      // current_monthly_goal 사용자 속성이 이 쿼리에서 나온다. 여기서 무효화하지
      // 않으면 온보딩에서 목표를 저장해도 이전 값이 캐시에 남는다.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recentGoal });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goalMonths });
      queryClient.invalidateQueries({ queryKey: ['report'] });

      // '지난 달과 똑같이'(isNew: false)는 goal에 0을 보내고 서버가 지난 목표를
      // 채워준다. 그래서 입력값이 아니라 응답값을 기준으로 삼아야 한다.
      const monthlyGoal = data.result?.goal ?? variables.goal;

      logEvent('goal_setup_completed', {
        entry_point: variables.entryPoint,
        goal_type: variables.isNew ? 'new' : 'same',
        monthly_goal: monthlyGoal,
      });

      // recentGoal 리페치를 기다리면 GET /goals 왕복만큼 늦어, 온보딩에서는 이미
      // 튜토리얼로 넘어간 뒤에야 속성이 반영된다. 값은 응답에 있으니 바로 세팅한다.
      setUserProps({ current_monthly_goal: monthlyGoal });
    },
  });
};
