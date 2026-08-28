import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

/** 오버레이가 놓인 컨테이너(rootRef) 기준 사각형 */
export type SpotlightRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DIM_COLOR = 'rgba(0, 0, 0, 0.6)';
// 하드 토글이면 딤이 "탁" 걸려서 스텝 사이가 끊겨 보인다. 크로스페이드로 잇는다.
const FADE_MS = 250;
// 툴팁이 화면 가장자리에 붙지 않도록 하는 최소 여백
const EDGE_INSET = 16;

type Props = {
  visible: boolean;
  /**
   * 스포트라이트 대상의 실제 렌더 위치. 런타임 측정값이라 기기 폭·노치가 달라도 따라간다.
   * null이면 딤만 깔린다.
   */
  rect?: SpotlightRect | null;
  /**
   * 오버레이가 놓인 컨테이너의 실측 크기.
   * Dimensions.get('window')는 Android edge-to-edge에서 실제 루트 뷰 크기와 다를 수 있어
   * 말풍선 위치가 어긋난다. rect와 같은 기준(rootRef)에서 잰 값을 받아 쓴다.
   */
  containerWidth: number;
  containerHeight: number;
  /**
   * 딤 위에 다시 그릴 UI. 실제 punch-hole 마스크 대신 대상을 복제해 올리는 방식이라
   * 여기에 대상과 같은 컴포넌트를 넘겨주면 된다. 탭도 이쪽이 받는다.
   */
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipPlacement?: 'above' | 'below';
  tooltipAlign?: 'left' | 'right';
  tooltipGap?: number;
  /** 마지막 스텝의 중앙 카드처럼 대상 없이 화면 가운데에 띄울 내용 */
  centerContent?: React.ReactNode;
  /** 딤 영역 탭. 지정하지 않으면 탭이 막히기만 한다. */
  onPressBackdrop?: () => void;
};

export function TutorialOverlay({
  visible,
  rect,
  containerWidth,
  containerHeight,
  children,
  tooltip,
  tooltipPlacement = 'above',
  tooltipAlign = 'left',
  tooltipGap = 10,
  centerContent,
  onPressBackdrop,
}: Props) {
  const opacity = useDerivedValue(
    () =>
      withTiming(visible ? 1 : 0, {
        duration: FADE_MS,
        easing: Easing.out(Easing.quad),
      }),
    [visible],
  );

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const horizontal =
    rect && tooltipAlign === 'right'
      ? { right: Math.max(EDGE_INSET, containerWidth - (rect.x + rect.width)) }
      : { left: Math.max(EDGE_INSET, rect?.x ?? 0) };

  const vertical =
    rect && tooltipPlacement === 'above'
      ? { bottom: containerHeight - rect.y + tooltipGap }
      : { top: (rect?.y ?? 0) + (rect?.height ?? 0) + tooltipGap };

  return (
    <Animated.View
      style={[styles.root, fadeStyle]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      {/* ===== 딤 ===== */}
      <Pressable
        style={[StyleSheet.absoluteFill, styles.dim]}
        onPress={onPressBackdrop}
      />

      {/* ===== 스포트라이트(대상 복제본) ===== */}
      {!!rect && !!children && (
        <Animated.View
          style={{
            position: 'absolute',
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
          }}
        >
          {children}
        </Animated.View>
      )}

      {/* ===== 코치마크 말풍선 ===== */}
      {!!rect && !!tooltip && (
        <Animated.View
          pointerEvents='none'
          style={[styles.tooltip, horizontal, vertical]}
        >
          {tooltip}
        </Animated.View>
      )}

      {/* ===== 중앙 카드 ===== */}
      {!!centerContent && (
        <Animated.View style={styles.center} pointerEvents='box-none'>
          {centerContent}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  dim: {
    backgroundColor: DIM_COLOR,
  },
  tooltip: {
    position: 'absolute',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
