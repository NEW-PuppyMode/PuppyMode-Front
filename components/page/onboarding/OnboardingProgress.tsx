import React from 'react';
import { StyleSheet, View } from 'react-native';

type OnboardingProgressProps = {
  /** 현재 단계 (1부터 시작) */
  step: number;
  /** 전체 단계 수 */
  total?: number;
};

/**
 * 온보딩 상단 진행 표시 점.
 * 현재 단계는 초록색 알약 형태, 나머지는 연한 초록 원으로 표시한다.
 */
export function OnboardingProgress({ step, total = 2 }: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index + 1 === step;
        return (
          <View
            key={index}
            style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
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
  dotActive: {
    width: 22,
    backgroundColor: '#0FD380',
  },
  dotInactive: {
    width: 10,
    backgroundColor: '#CBF1D3',
  },
});
