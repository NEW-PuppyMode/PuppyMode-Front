/* eslint-disable @typescript-eslint/no-require-imports */
import { LevelUpEvent } from '@/hooks/home/useLevelUpDetector';
import { getGrowthStage, getPuppyGifSource } from '@/utils/dogMapper';
import { Image as Gif } from 'expo-image';
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

const SPARKLE_IMAGE = require('@/assets/images/home/sparkle_effect.png');

type ReactionState = 'normal' | 'angry' | 'heart';

// 이전 외형이 사라지고(페이드아웃) → 새 외형이 나타나는(페이드인) 시간. 겹치지 않도록 순차 진행.
const FADE_OUT_MS = 450; // 외형 교체 시점
const FADE_IN_MS = 550;

// 반짝이: 강아지 뒤에서 위로 떠오르며 배지 수명에 맞춰 등장/소멸
// 세로 이동(강아지 중심 기준, 음수 = 위쪽). 실제 배지 위치에 맞춰 값만 조정하면 됨.
const SPARKLE_START_Y = 10; // 시작(강아지 뒤, 살짝 아래)
const SPARKLE_PEAK_Y = -180; // 배지 비슷한 위치(머무는 지점)
const SPARKLE_EXIT_Y = -230; // 위로 날아가며 사라지는 지점
const SPARKLE_RISE_MS = 450; // 떠오르며 페이드인
const SPARKLE_HOLD_MS = 900; // 잠깐 머묾
const SPARKLE_EXIT_MS = 400; // 위로 날아가며 페이드아웃
const SPARKLE_SCALE = 1.2; // 강아지(size) 대비 반짝이 크기 배율

interface Props {
  breedName: string;
  level: number;
  reaction: ReactionState;
  // didEvolve(레벨 10·20 도달) 이벤트. 값이 바뀌면 외형 변화 연출을 1회 재생.
  evolveEvent: LevelUpEvent | null;
  size?: number;
}

export function EvolvingPuppy({
  breedName,
  level,
  reaction,
  evolveEvent,
  size = 264,
}: Props) {
  // 화면에 보여줄 외형(레벨). 외형 변화 연출 중에는 페이드아웃이 끝난 시점에
  // 새 레벨로 교체되어, 이전/새 강아지가 겹쳐 보이지 않는다.
  const [shownLevel, setShownLevel] = useState(level);
  const [sparkleActive, setSparkleActive] = useState(false);

  const puppyOpacity = useSharedValue(1); // 강아지 본체 불투명도(1→0→1)
  const sparkleOpacity = useSharedValue(0);
  const sparkleY = useSharedValue(SPARKLE_START_Y);

  const animatingRef = useRef(false);
  const lastEventIdRef = useRef(0);

  // 외형 변화 연출 (didEvolve일 때만): 이전 외형 페이드아웃 → 레벨 교체 → 새 외형 페이드인
  useEffect(() => {
    if (
      !evolveEvent ||
      !evolveEvent.didEvolve ||
      evolveEvent.id === lastEventIdRef.current
    ) {
      return;
    }
    lastEventIdRef.current = evolveEvent.id;
    animatingRef.current = true;

    const toLevel = evolveEvent.toLevel;
    setShownLevel(evolveEvent.fromLevel); // 베이스를 이전 외형으로 고정

    // --- 강아지: 페이드아웃 → 교체 → 페이드인 ---
    puppyOpacity.value = 1;
    puppyOpacity.value = withSequence(
      withTiming(
        0,
        { duration: FADE_OUT_MS, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(swapToNew)(toLevel);
        },
      ),
      withTiming(
        1,
        { duration: FADE_IN_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(finishEvolve)();
        },
      ),
    );

    // --- 반짝이: 강아지 뒤에서 위로 떠오름 → 배지 위치에서 잠깐 머묾 → 위로 날아가며 사라짐 ---
    setSparkleActive(true);
    sparkleY.value = SPARKLE_START_Y;
    sparkleOpacity.value = 0;
    sparkleY.value = withSequence(
      withTiming(SPARKLE_PEAK_Y, {
        duration: SPARKLE_RISE_MS,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        SPARKLE_HOLD_MS,
        withTiming(SPARKLE_EXIT_Y, {
          duration: SPARKLE_EXIT_MS,
          easing: Easing.in(Easing.cubic),
        }),
      ),
    );
    sparkleOpacity.value = withSequence(
      withTiming(1, { duration: SPARKLE_RISE_MS }),
      withDelay(
        SPARKLE_HOLD_MS,
        withTiming(0, { duration: SPARKLE_EXIT_MS }, (finished) => {
          if (finished) runOnJS(setSparkleActive)(false);
        }),
      ),
    );

    function swapToNew(newLevel: number) {
      setShownLevel(newLevel);
    }
    function finishEvolve() {
      animatingRef.current = false;
    }
  }, [evolveEvent, puppyOpacity, sparkleOpacity, sparkleY]);

  // 일반 동기화: 연출 중이 아니면 보여줄 외형을 현재 레벨로 맞춘다.
  // 단, 성장 단계(외형)가 바뀌는 변화는 외형 변화 연출이 전담하므로 여기서 건드리지 않는다.
  // (detector의 evolveEvent가 level보다 한 렌더 늦게 도착하는 사이에 새 외형이 번쩍 보였다가 되돌아오는 문제를 방지)
  useEffect(() => {
    if (animatingRef.current) return;
    setShownLevel((prev) =>
      getGrowthStage(level) === getGrowthStage(prev) ? level : prev,
    );
  }, [level]);

  const puppyStyle = useAnimatedStyle(() => ({
    opacity: puppyOpacity.value,
  }));
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ translateY: sparkleY.value }],
  }));

  const sparkleWidth = Math.round(size * SPARKLE_SCALE);
  const sparkleHeight = Math.round((sparkleWidth * 264) / 393);

  return (
    <View pointerEvents='none' style={styles.center}>
      {/* 반짝이: 강아지 '뒤'에 두기 위해 먼저 렌더(아래 레이어) */}
      {sparkleActive && (
        <Animated.View
          style={[
            styles.sparkle,
            { width: sparkleWidth, height: sparkleHeight },
            sparkleStyle,
          ]}
        >
          <Gif
            source={SPARKLE_IMAGE}
            style={{ width: sparkleWidth, height: sparkleHeight }}
            contentFit='contain'
          />
        </Animated.View>
      )}

      {/* 강아지 본체 (연출 중엔 페이드아웃→교체→페이드인) */}
      <Animated.View style={puppyStyle}>
        <Gif
          source={getPuppyGifSource(breedName, shownLevel, reaction)}
          style={{ width: size, height: size }}
          contentFit='contain'
          autoplay
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
