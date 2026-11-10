import { ProgressCard } from '@/components/page/home/ProgressCard';
import { LevelUpEvent } from '@/hooks/home/useLevelUpDetector';
import { PuppyProgress } from '@/services/reportData';
import { getGrowthStage } from '@/utils/dogMapper';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// 스텝이 뜨고 카드를 한 번 본 뒤에 게이지가 차오르도록 잠시 기다린다.
const FILL_DELAY_MS = 400;

type ExpGainCardProps = {
  /** 보상 받기 전 레벨·경험치 */
  before: PuppyProgress;
  /** 보상 받은 뒤 레벨·경험치 */
  after: PuppyProgress;
  /** 강아지 이름 (홈 상단 바와 같은 값) */
  puppyName: string;
};

/**
 * 목표 갱신 화면의 경험치 획득 스텝에서 말풍선 자리에 들어가는 경험치 카드.
 * 홈 상단 바의 ProgressCard를 그대로 쓰고 크기·배경만 이 화면에 맞춘다.
 *
 * 보상 전 값으로 그렸다가 보상 후 값으로 바꿔 게이지가 차오르게 한다. 레벨이 오르면
 * 홈과 같은 레벨업 연출(100%까지 채움 → 레벨 갱신 → 새 %까지 채움)을 쓴다.
 */
export function ExpGainCard({ before, after, puppyName }: ExpGainCardProps) {
  const [shown, setShown] = useState(before);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // ProgressCard는 레벨업 이벤트와 새 값이 같은 렌더에 들어와야 레벨업 연출을 탄다.
      if (after.level > before.level) {
        setLevelUpEvent({
          id: 1,
          fromLevel: before.level,
          toLevel: after.level,
          didEvolve:
            getGrowthStage(before.level) !== getGrowthStage(after.level),
        });
      }
      setShown(after);
    }, FILL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [before, after]);

  return (
    <View style={styles.card}>
      <ProgressCard
        className='px-[18px] py-3 bg-transparent'
        level={shown.level}
        puppyName={puppyName}
        percent={shown.percent}
        levelUpEvent={levelUpEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 204,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    overflow: 'hidden',
  },
});
