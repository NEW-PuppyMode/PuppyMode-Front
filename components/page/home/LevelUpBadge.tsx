import LevelUpBadgeSvg from '@/assets/images/home/level-up-badge.svg';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// SVG 원본 비율(viewBox 87 x 35)을 유지하며 렌더 (벡터라 확대해도 깨지지 않음)
const BADGE_WIDTH = 98;
const BADGE_HEIGHT = Math.round((BADGE_WIDTH * 35) / 87);

const POP_IN_MS = 350; // 등장(팝인)
const HOLD_MS = 1000; // 유지
const FADE_OUT_MS = 350; // 사라짐

interface Props {
  // 레벨업 이벤트 id. 값이 바뀌면 1회 재생한다. (0이면 재생 안 함)
  trigger: number;
  onDone?: () => void;
}

export function LevelUpBadge({ trigger, onDone }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const [visible, setVisible] = useState(false);
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    if (!trigger || trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;

    setVisible(true);
    opacity.value = 0;
    scale.value = 0.6;

    // 팝인(살짝 오버슈트) → 유지 → 페이드아웃
    scale.value = withSequence(
      withTiming(1, {
        duration: POP_IN_MS,
        easing: Easing.out(Easing.back(2)),
      }),
      withDelay(HOLD_MS, withTiming(1, { duration: FADE_OUT_MS })),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: POP_IN_MS, easing: Easing.out(Easing.cubic) }),
      withDelay(
        HOLD_MS,
        withTiming(0, { duration: FADE_OUT_MS }, (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
            if (onDone) runOnJS(onDone)();
          }
        }),
      ),
    );
  }, [trigger, opacity, scale, onDone]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View pointerEvents='none' style={styles.overlay}>
      <Animated.View style={animatedStyle}>
        <LevelUpBadgeSvg width={BADGE_WIDTH} height={BADGE_HEIGHT} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // 강아지 위쪽(상단에서 약 -% 지점)에 배지가 뜨도록
    paddingTop: '76%',
  },
});
