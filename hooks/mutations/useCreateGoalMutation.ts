import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { GoalDTO } from '@/types/models/puppy';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: GoalDTO) => PuppyDataAPI.createGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
    },
  });
};
