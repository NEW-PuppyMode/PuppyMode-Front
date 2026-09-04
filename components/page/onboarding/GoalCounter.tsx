import { ControlButton } from '@/components/page/home/ControlButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { maxDaysInMonth } from '@/utils/dateUtils';
import { StyleSheet, View } from 'react-native';

type GoalCounterProps = {
  /** 현재 목표 횟수 */
  value: number;
  /** 증감 버튼으로 바뀐 값 */
  onChange: (next: number) => void;
  /** 최소 목표 횟수 */
  min?: number;
  /** 최대 목표 횟수. 기본값은 이번 달의 일수 */
  max?: number;
};

/**
 * 이번 달 목표 음주 횟수를 고르는 카운터.
 *
 * 최초 온보딩(app/onboarding)과 월간 목표 갱신이 같은 UI를 쓰므로 화면에서 분리했다.
 * 값은 부모가 들고 있고 여기서는 범위만 지킨다.
 */
export function GoalCounter({
  value,
  onChange,
  min = 1,
  max = maxDaysInMonth,
}: GoalCounterProps) {
  return (
    <View style={styles.row}>
      <ControlButton
        label='-'
        onPress={() => onChange(Math.max(min, value - 1))}
      />
      <ThemedView className='px-5 py-3 mx-1 bg-green-100 shadow-sm rounded-2xl'>
        <ThemedText
          style={{ color: '#21D08A', fontWeight: '600', fontSize: 16 }}
          className='text-green-500'
        >
          {value}번
        </ThemedText>
      </ThemedView>
      <ControlButton
        label='+'
        onPress={() => onChange(Math.min(max, value + 1))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
