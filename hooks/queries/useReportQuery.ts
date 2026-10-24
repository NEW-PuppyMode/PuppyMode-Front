import { ReportApi } from '@/services/reportData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

// enabled는 조회할 달이 정해지기 전에 호출되지 않도록 막는 용도다. 꺼져 있는 동안
// isPending이 계속 true이므로 호출부에서 함께 따져야 한다.
export const useReportQuery = (year: number, month: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.report(year, month),
    queryFn: () => ReportApi.lookupReport(year, month),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
};
