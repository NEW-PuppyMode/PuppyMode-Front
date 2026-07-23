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
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { OnboardingProgress } from './OnboardingProgress';

// home보다 살짝 작은 강아지 (home: 288)
const PUPPY_SIZE = 250;
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
  children,
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();
  const keyboardAnim = useRef(new Animated.Value(0)).current;

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
        <View style={styles.progressWrapper}>
          <OnboardingProgress step={step} total={totalSteps} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.middle}>
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
            level={1}
            reaction='normal'
            evolveEvent={null}
            size={PUPPY_SIZE}
          />
        </View>

        <Animated.View
          style={[
            styles.bottom,
            {
              transform: [{ translateY: Animated.multiply(keyboardAnim, -1) }],
            },
          ]}
        >
          {children}
        </Animated.View>
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
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
