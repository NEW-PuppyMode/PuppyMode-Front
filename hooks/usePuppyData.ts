import { handelError } from '@/services/handelErrors';
import { PuppyDataAPI } from '@/services/puppyData';
import axios from 'axios';
import { useState } from 'react';

export const usePuppyData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const renamePuppy = async (authCode: string) => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.renamePuppy(authCode);

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('log');
      } else {
        handelError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renameUser = async (authCode: string) => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.renameUser(authCode);

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('log');
      } else {
        handelError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const advicePuppy = async () => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.advicePuppy();

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('log');
      } else {
        handelError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    renamePuppy,
    renameUser,
    advicePuppy,
    isLoading,
    setIsLoading,
  };
};
