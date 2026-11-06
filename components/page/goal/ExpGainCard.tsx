import { ProgressCard } from '@/components/page/home/ProgressCard';
import { PuppyProgress } from '@/services/reportData';
import { StyleSheet, View } from 'react-native';

type ExpGainCardProps = {
  /** 보상 받은 뒤 레벨·경험치 */
  after: PuppyProgress;
  /** 강아지 이름 (홈 상단 바와 같은 값) */
  puppyName: string;
};

/**
 * 목표 갱신 화면의 경험치 획득 스텝에서 말풍선 자리에 들어가는 경험치 카드.
 * 홈 상단 바의 ProgressCard를 그대로 쓰고 크기·배경만 이 화면에 맞춘다.
 */
export function ExpGainCard({ after, puppyName }: ExpGainCardProps) {
  return (
    <View style={styles.card}>
      <ProgressCard
        className='px-[18px] py-3 bg-transparent'
        level={after.level}
        puppyName={puppyName}
        percent={after.percent}
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
