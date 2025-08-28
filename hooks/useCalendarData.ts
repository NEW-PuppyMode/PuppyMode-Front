import { CalendarApi, CalendarDayDTO } from '@/services/CalendarData';
import { handelError } from '@/services/handelErrors';
import axios from 'axios';
import { useState } from 'react';

export const useCalendarData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupCalendar = async (year: number, month: number) => {
    setIsLoading(true);

    try {
      const data = await CalendarApi.lookupCalendar(year, month);
      return data as CalendarDayDTO[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('401 Unauthorized');
      } else {
        handelError(error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCalendar,
    isLoading,
    setIsLoading,
  };
};
