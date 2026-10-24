/* eslint-disable @typescript-eslint/no-require-imports */
import { EvolvingPuppy } from '@/components/page/home/EvolvingPuppy';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { OnboardingProgress } from './OnboardingProgress';

// home보다 살짝 작은 강아지 (home: 288)
const PUPPY_MAX_SIZE = 250;
// 강아지 크기와 위치는 하단 영역이 아니라 화면(안전 영역) 높이 기준으로 정한다.
// 하단 영역은 단계마다 높이가 달라서(카운터·선택 카드·입력창), 거기에 붙이면 단계를
// 넘길 때 강아지가 오르내리고, 작은 화면에서는 말풍선이 부제를 덮는다.
// - 크기: 안전 영역 높이의 비율. 큰 화면에서는 PUPPY_MAX_SIZE에서 멈춘다.
// - 위치: 강아지 아래 끝을 안전 영역 아래에서 이 비율만큼 띄운다. 가장 높은 하단
//   영역(선택 카드 + 버튼)과 겹치지 않을 정도로 잡았다.
const PUPPY_SIZE_RATIO = 0.32;
const PUPPY_BOTTOM_RATIO = 0.24;
// 말풍선 최소 높이(3줄 기준). 단계별 멘트 줄 수가 달라도 높이를 일정하게 유지한다.
const BUBBLE_MIN_HEIGHT = 120;

type OnboardingLayoutProps = {
  /** 진행 단계 (1부터 시작) */
  step: number;
  /** 전체 단계 수 (진행 점 개수) */
  totalSteps?: number;
  /** 상단 강조 타이틀 (초록 강조는 <Text style={{ color: '#0FD380' }}> 로 감싼다) */
  title: React.ReactNode;
  /** 타이틀 하단 보조 설명 */
  subtitle: string;
  /** 강아지 말풍선 내용 */
  bubbleText: string;
  /** 강아지 종(한글). 미지정 시 기본 비숑 */
  breed?: string;
  /** 강아지 레벨(성장 단계 외형 결정). 미지정 시 1. 마운트 후 성장 단계가 바뀌는 변화는 반영되지 않는다. */
  level?: number;
  /** 하단 입력/버튼 영역. 키보드가 올라오면 함께 따라 올라온다. */
  children: React.ReactNode;
};

/**
 * 온보딩 공통 레이아웃.
 * 배경(home과 동일) · 진행 점 · 타이틀 · 말풍선(home SpeechBubble) · 강아지(home EvolvingPuppy)를
 * 항상 유지하고, 하단 영역(children)만 단계별로 바꿔 한 화면 안에서 자연스럽게 이어지도록 한다.
 * 하단 영역은 home 이름 짓기처럼 키보드 높이에 맞춰 함께 올라온다.
 */
export function OnboardingLayout({
  step,
  totalSteps = 3,
  title,
  subtitle,
  bubbleText,
  breed = '',
  level = 1,
  children,
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  const { height: windowHeight } = useWindowDimensions();
  const safeHeight = windowHeight - insets.top - insets.bottom;
  const puppySize = Math.min(
    PUPPY_MAX_SIZE,
    Math.round(safeHeight * PUPPY_SIZE_RATIO),
  );
  const puppyBottom = Math.round(safeHeight * PUPPY_BOTTOM_RATIO);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: Math.max(0, e.endCoordinates.height - insets.bottom),
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });
    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom, keyboardAnim]);

  return (
    <ImageBackground
      source={require('@/assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* 말풍선·강아지는 흐름에서 빼서 화면 기준 위치에 고정한다. 하단 영역보다 먼저
              그려서, 겹치더라도 버튼·입력이 위에 오고 터치를 가로채지 않는다. */}
          <View
            style={[styles.stage, { bottom: puppyBottom }]}
            pointerEvents='box-none'
          >
            <View style={styles.bubbleWrapper}>
              {/* step이 바뀌면 remount 되어 등장 애니메이션이 다시 재생된다. */}
              <SpeechBubble
                key={step}
                minHeight={BUBBLE_MIN_HEIGHT}
                tailScale={2.4}
              >
                {bubbleText}
              </SpeechBubble>
            </View>
            <EvolvingPuppy
              breedName={breed}
              level={level}
              reaction='normal'
              evolveEvent={null}
              size={puppySize}
            />
          </View>

          <View style={styles.progressWrapper}>
            <OnboardingProgress step={step} total={totalSteps} />
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* 하단 영역을 화면 아래에 붙인다. 입력 칸이 높아지면 위로만 커지므로 버튼 위치는 그대로다. */}
          <View style={styles.spacer} />

          <Animated.View
            style={[
              styles.bottom,
              {
                transform: [
                  { translateY: Animated.multiply(keyboardAnim, -1) },
                ],
              },
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressWrapper: {
    alignItems: 'center',
    marginTop: 26,
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 28,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: '#777777',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  bubbleWrapper: {
    width: '100%',
    marginBottom: -40,
  },
  bottom: {
    paddingVertical: 14,
    gap: 16,
  },
});
