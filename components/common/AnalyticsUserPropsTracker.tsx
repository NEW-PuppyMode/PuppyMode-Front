import { useAnalyticsUserProps } from '@/hooks/analytics/useAnalyticsUserProps';

/**
 * 사용자 속성 세팅만 담당하는 빈 컴포넌트.
 * 훅이 쿼리 캐시를 구독해야 해서 Provider 안쪽에 마운트한다.
 * (AnalyticsRouteTracker와 같은 자리)
 */
export function AnalyticsUserPropsTracker() {
  useAnalyticsUserProps();
  return null;
}
