import { getGrowthStage } from '@/utils/dogMapper';
import { useEffect, useRef, useState } from 'react';

export interface LevelUpEvent {
  // 이벤트 식별용(같은 레벨업이 중복 처리되지 않도록 구분)
  id: number;
  // 이전/현재 레벨
  fromLevel: number;
  toLevel: number;
  // 외형(성장 단계)이 바뀌었는지 (레벨 10 / 20 도달)
  didEvolve: boolean;
}

/**
 * puppyLevel 변화를 추적해 레벨업 이벤트를 방출한다.
 * - 서버는 "레벨업했다"는 신호를 따로 주지 않으므로 이전 레벨과 비교해 감지한다.
 * - 첫 로드(이전 레벨 없음)나 레벨 하락/동일에서는 트리거하지 않는다.
 */
export function useLevelUpDetector(level: number | undefined): LevelUpEvent | null {
  const prevLevelRef = useRef<number | null>(null);
  const eventIdRef = useRef(0);
  const [event, setEvent] = useState<LevelUpEvent | null>(null);

  useEffect(() => {
    if (level === undefined) return;

    const prev = prevLevelRef.current;
    prevLevelRef.current = level;

    // 첫 관측이거나 레벨이 오르지 않았으면 무시
    if (prev === null || level <= prev) return;

    eventIdRef.current += 1;
    setEvent({
      id: eventIdRef.current,
      fromLevel: prev,
      toLevel: level,
      didEvolve: getGrowthStage(prev) !== getGrowthStage(level),
    });
  }, [level]);

  return event;
}
