import { handelError } from '@/services/handelErrors';
import { PuppyDataAPI } from '@/services/puppyData';
import { DrinkHistoryDTO, GoalDTO, IPuppyInfo } from '@/types/models/puppy';
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
      console.log('fetchPuppyInfo', data);
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

  const fetchIsRecorded = async () => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.fetchIsRecorded();
      console.log('fetchIsRecorded', data.result);
      return data.result;
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

  const fetchRecentGoal = async () => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.fetchRecentGoal();
      console.log('fetchRecentGoal', data.result);
      return data.result;
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

  const fetchGoal30daysPassed = async () => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.fetchGoal30daysPassed();
      console.log('fetchGoal30daysPassed', data.result);
      return data.result;
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

  const createDrinkHistory = async (drinkHistory: DrinkHistoryDTO) => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.createDrinkHistory(drinkHistory);
      return data.result;
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

  const createGoal = async (goal: GoalDTO) => {
    setIsLoading(true);

    try {
      const data = await PuppyDataAPI.createGoal(goal);
      return data.result;
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
    fetchIsRecorded,
    fetchRecentGoal,
    fetchGoal30daysPassed,
    fetchPuppyInfo,
    advicePuppy,
    createDrinkHistory,
    createGoal,
    renamePuppy,
    renameUser,
    puppyInfo,
    isLoading,
    setIsLoading,
  };
};
