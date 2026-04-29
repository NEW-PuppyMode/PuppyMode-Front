import { ReportApi } from '@/services/reportData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useReportQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.report(year, month),
    queryFn: () => ReportApi.lookupReport(year, month),
    staleTime: 1000 * 60 * 10,
  });
};
