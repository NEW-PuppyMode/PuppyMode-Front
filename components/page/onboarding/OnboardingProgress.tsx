import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const INACTIVE_COLOR = '#CBF1D3';
const ACTIVE_COLOR = '#0FD380';
const INACTIVE_WIDTH = 10;
const ACTIVE_WIDTH = 22;
const DURATION = 300;

type OnboardingProgressProps = {
  /** 현재 단계 (1부터 시작) */
  step: number;
  /** 전체 단계 수 */
  total?: number;
};

/**
 * 온보딩 상단 진행 표시 점.
 * 단계 전환 시 애니메이션.
 */
export function OnboardingProgress({
  step,
  total = 2,
}: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot key={index} active={index + 1 === step} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  // 0 = 비활성, 1 = 활성
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: DURATION });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [INACTIVE_WIDTH, ACTIVE_WIDTH]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [INACTIVE_COLOR, ACTIVE_COLOR],
    ),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 10,
    borderRadius: 100,
  },
});
