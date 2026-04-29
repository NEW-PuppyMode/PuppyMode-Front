import { PuppyDataAPI } from '@/services/puppyData';
import { useMutation } from '@tanstack/react-query';

export const useAdvicePuppyMutation = () => {
  return useMutation({
    mutationFn: () => PuppyDataAPI.advicePuppy(),
  });
};
