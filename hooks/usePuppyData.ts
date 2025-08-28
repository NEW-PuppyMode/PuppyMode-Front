import { handelError } from '@/services/handelErrors';
import { PuppyDataAPI } from '@/services/puppyData';
import { IPuppyInfo } from '@/types/models/puppy';
import axios from 'axios';
import { useState } from 'react';

export const usePuppyData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [puppyInfo, setPuppyInfo] = useState<IPuppyInfo | null>(null);

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
      console.log(data.result.advice);
      return data.result.advice;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('401');
      } else {
        handelError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPuppyInfo = async () => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.fetchPuppyInfo();
      setPuppyInfo(data.result);
      console.log('강아지 정보', data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('401 error');
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
    fetchPuppyInfo,
    puppyInfo,
    isLoading,
    setIsLoading,
  };
};
