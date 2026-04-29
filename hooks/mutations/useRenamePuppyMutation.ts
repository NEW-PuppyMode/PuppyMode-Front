import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRenamePuppyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (puppyName: string) => PuppyDataAPI.renamePuppy(puppyName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
    },
  });
};
