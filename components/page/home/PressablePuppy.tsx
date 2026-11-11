import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// 누르는 동안 강아지가 살짝 작아졌다가, 떼면 튕기듯 원래 크기로 돌아온다.
// 조언(onPress, 3초 throttle)과 별개로 터치할 때마다 즉시 반응해 "눌렸다"는 피드백을 준다.
const PRESSED_SCALE = 0.96;
const PRESS_IN_MS = 80;
const RELEASE_SPRING = { damping: 10, stiffness: 300, mass: 0.5 };

interface Props {
  onPress: () => void;
  children: ReactNode;
}

export function PressablePuppy({ onPress, children }: Props) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(PRESSED_SCALE, {
      duration: PRESS_IN_MS,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 터치 영역(Pressable)은 고정하고 안쪽 내용만 축소해, 누르는 중에 터치 영역이 줄어들지 않게 한다.
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole='button'
    >
      <Animated.View style={scaleStyle}>{children}</Animated.View>
    </Pressable>
  );
}
