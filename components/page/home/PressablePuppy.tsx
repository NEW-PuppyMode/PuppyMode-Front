/* eslint-disable @typescript-eslint/no-require-imports */
import {
  BreedKey,
  getBreedKey,
  getGrowthStage,
  GrowthKey,
} from '@/utils/dogMapper';
import { ReactNode } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// 클릭 효과선 (피그마 Click1/Click2 프레임, 강아지 GIF와 같은 정사각형 기준으로 그려짐)
const CLICK_EFFECT_PRESS = require('@/assets/images/home/click_effect_1.png');
const CLICK_EFFECT_RELEASE = require('@/assets/images/home/click_effect_2.png');

// 누르는 동안 강아지가 살짝 작아졌다가, 떼면 튕기듯 원래 크기로 돌아온다.
// 조언(onPress, 3초 throttle)과 별개로 터치할 때마다 즉시 반응해 "눌렸다"는 피드백을 준다.
const PRESSED_SCALE = 0.96;
const PRESS_IN_MS = 80;
const RELEASE_SPRING = { damping: 10, stiffness: 300, mass: 0.5 };

// 효과선: 누르는 동안 Click1 → 떼면 Click2가 잠깐 보였다가 사라짐
const RELEASE_HOLD_MS = 150; // Click2 유지 시간
const RELEASE_FADE_MS = 80; // Click2 페이드아웃 시간
// 강아지(견종 × 성장 단계)별 효과선 크기·위치.
// - scale: 강아지 크기 대비 배율. 강아지 중심 기준으로 커지므로 키울수록 양쪽 선이 머리 바깥으로 벌어진다.
// - x, y: 추가 이동(px, 강아지 288 기준). x 음수 = 왼쪽, y 음수 = 위쪽.
type EffectLayout = { scale: number; x: number; y: number };

// 비숑 // 푸들 // 시바 // 코기
// x: 우측으로, y: 아래로
const CLICK_EFFECT_LAYOUT: Record<BreedKey, Record<GrowthKey, EffectLayout>> = {
  bichon: {
    growth1: { scale: 1.05, x: 0, y: 0 },
    growth2: { scale: 1.08, x: 0, y: -4 },
    growth3: { scale: 1.1, x: 0, y: -2 },
  },
  poodle: {
    growth1: { scale: 0.95, x: 5, y: 0 },
    growth2: { scale: 0.95, x: 5, y: -10 },
    growth3: { scale: 0.94, x: 5, y: -18 },
  },
  shiba: {
    growth1: { scale: 1.08, x: -2, y: -13 },
    growth2: { scale: 1.07, x: -6, y: -22 },
    growth3: { scale: 1.05, x: -10, y: -30 },
  },
  welshcorgi: {
    growth1: { scale: 1.1, x: 4, y: -10 },
    growth2: { scale: 1.08, x: 0, y: -16 },
    growth3: { scale: 1.07, x: -13, y: -20 },
  },
};

interface Props {
  onPress: () => void;
  // 강아지 GIF 크기. 효과선 오버레이를 같은 크기로 겹친다.
  size: number;
  // 강아지 종 이름·레벨. 강아지별 효과선 크기·위치(CLICK_EFFECT_LAYOUT)를 고르는 데 쓴다.
  breedName: string;
  level: number;
  children: ReactNode;
}

export function PressablePuppy({
  onPress,
  size,
  breedName,
  level,
  children,
}: Props) {
  const scale = useSharedValue(1);
  const pressEffectOpacity = useSharedValue(0);
  const releaseEffectOpacity = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withTiming(PRESSED_SCALE, {
      duration: PRESS_IN_MS,
      easing: Easing.out(Easing.quad),
    });
    // 연타 시 이전 Click2가 남아 있지 않도록 즉시 끄고 Click1을 켠다.
    releaseEffectOpacity.value = 0;
    pressEffectOpacity.value = 1;
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
    pressEffectOpacity.value = 0;
    releaseEffectOpacity.value = 1;
    releaseEffectOpacity.value = withDelay(
      RELEASE_HOLD_MS,
      withTiming(0, { duration: RELEASE_FADE_MS }),
    );
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const pressEffectStyle = useAnimatedStyle(() => ({
    opacity: pressEffectOpacity.value,
  }));
  const releaseEffectStyle = useAnimatedStyle(() => ({
    opacity: releaseEffectOpacity.value,
  }));

  // 강아지보다 큰 효과선을 강아지 중심에 맞추기 위해 늘어난 만큼 위·왼쪽으로 당긴 뒤, 강아지별 x·y만큼 옮긴다.
  const layout =
    CLICK_EFFECT_LAYOUT[getBreedKey(breedName)][getGrowthStage(level)];
  const effectLength = Math.round(size * layout.scale);
  const effectOffset = (size - effectLength) / 2;
  const effectSize = { width: effectLength, height: effectLength };
  const effectPosition = {
    top: effectOffset + layout.y,
    left: effectOffset + layout.x,
  };

  // 터치 영역(Pressable)은 고정하고 안쪽 내용만 축소해, 누르는 중에 터치 영역이 줄어들지 않게 한다.
  // 효과선은 축소 바깥에 두어 강아지만 눌리는 느낌을 준다.
  // 두 이미지를 미리 올려두고 투명도만 바꿔, 첫 탭부터 지연 없이 보이게 한다.
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole='button'
    >
      <Animated.View style={scaleStyle}>{children}</Animated.View>

      <Animated.View
        pointerEvents='none'
        style={[styles.effect, effectSize, effectPosition, pressEffectStyle]}
      >
        <Image source={CLICK_EFFECT_PRESS} style={effectSize} />
      </Animated.View>
      <Animated.View
        pointerEvents='none'
        style={[styles.effect, effectSize, effectPosition, releaseEffectStyle]}
      >
        <Image source={CLICK_EFFECT_RELEASE} style={effectSize} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  effect: {
    position: 'absolute',
  },
});
