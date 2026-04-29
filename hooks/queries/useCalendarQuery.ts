import { CalendarApi } from '@/services/CalendarData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useCalendarQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.calendar(year, month),
    queryFn: () => CalendarApi.lookupCalendar(year, month),
  });
};
