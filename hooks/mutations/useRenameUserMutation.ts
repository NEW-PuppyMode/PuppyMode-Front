import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRenameUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userName: string) => PuppyDataAPI.renameUser(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
    },
  });
};
