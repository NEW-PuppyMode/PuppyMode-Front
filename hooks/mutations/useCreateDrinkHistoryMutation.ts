import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { PuppyDataAPI } from '@/services/puppyData';
import { DrinkHistoryDTO } from '@/types/models/puppy';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateDrinkHistoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (drinkHistory: DrinkHistoryDTO) =>
      PuppyDataAPI.createDrinkHistory(drinkHistory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.isRecorded });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};
