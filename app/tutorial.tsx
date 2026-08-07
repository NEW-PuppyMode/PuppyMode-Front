/* eslint-disable @typescript-eslint/no-require-imports */
import CalendarTodayIcon from '@/assets/icons/home/ic_calendar_t.svg';
import CalendarVIcon from '@/assets/icons/home/ic_calendar_v.svg';
import CalendarYesterdayIcon from '@/assets/icons/home/ic_calendar_y.svg';
import MessageIcon from '@/assets/icons/home/ic_message.svg';
import { EvolvingPuppy } from '@/components/page/home/EvolvingPuppy';
import { IconButton } from '@/components/page/home/IconButton';
import { LevelUpBadge } from '@/components/page/home/LevelUpBadge';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import { TopBar } from '@/components/page/home/TopBar';
import { CoachTooltip } from '@/components/page/tutorial/CoachTooltip';
import { TutorialFinishCard } from '@/components/page/tutorial/TutorialFinishCard';
import {
  TutorialOverlay,
  type SpotlightRect,
} from '@/components/page/tutorial/TutorialOverlay';
import { ThemedView } from '@/components/ThemedView';
import { PUPPY_MESSAGES } from '@/constants/messages';
import { useLevelUpDetector } from '@/hooks/home/useLevelUpDetector';
import { useCreateDrinkHistoryMutation } from '@/hooks/mutations/useCreateDrinkHistoryMutation';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { logButtonTap } from '@/utils/analytics';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * 온보딩 직후 1회 노출되는 튜토리얼.
 *
 * 홈 화면을 그대로 복제하지 않고, 홈의 프레젠테이셔널 컴포넌트(TopBar / IconButton /
 * SpeechBubble / EvolvingPuppy)만 조립해 스텝을 스크립트한다. 레이아웃은 홈과
 * 동일한 flex 구조를 써야 스포트라이트가 어긋나지 않는다.
 *
 * "튜토리얼을 봤는지"는 저장하지 않는다. 온보딩 완료 시점에만 진입하고, 중도 이탈 후
 * 재진입하면 app/index.tsx가 isOnboarded를 보고 홈으로 보내므로 재노출되지 않는다.
 */

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 4번(기록 완료 연출)을 최소한 이만큼은 보여준 뒤 5번으로 넘어간다.
// 강아지 리액션(2s)이 잦아드는 시점과 맞춘다.
const STEP4_HOLD_MS = 2000;
// 5번 진입 후 딤이 다 깔린 다음에 경험치를 반영해야 게이지가 차오르는 게 보인다.
const XP_REVEAL_DELAY_MS = 400;

export default function TutorialScreen() {
  const { data: puppyInfo, isFetching } = usePuppyInfoQuery();
  const createDrinkHistoryMutation = useCreateDrinkHistoryMutation();

  const [step, setStep] = useState<Step>(1);
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  // 버튼 행이 1줄↔2줄로 바뀌면 패널이 위아래로 움직인다. 그 순간을 실제 레이아웃
  // 이벤트로 잡아 재측정해야 스포트라이트가 이전 위치에 남지 않는다.
  const [layoutTick, setLayoutTick] = useState(0);

  const [reaction, setReaction] = useState<'normal' | 'angry' | 'heart'>(
    'normal',
  );
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 경험치/레벨은 기록 직후가 아니라 5번 스텝에서 공개한다.
   * 기록하자마자 반영하면 딤이 없는 4번에서 게이지가 조용히 올라가버려서,
   * 정작 "경험치가 올라갔어요!"를 띄우는 5번엔 보여줄 변화가 남지 않는다.
   */
  const [displayedLevel, setDisplayedLevel] = useState<number | null>(null);
  const [displayedPercent, setDisplayedPercent] = useState<number | null>(null);
  const revealedRef = useRef(false);

  const [recordDone, setRecordDone] = useState(false);
  const recordingRef = useRef(false);
  const step4StartedAtRef = useRef(0);

  const topBarRef = useRef<View>(null);
  const recordButtonRef = useRef<View>(null);
  const yesterdayButtonRef = useRef<View>(null);

  // 레벨업 연출도 공개 시점(5번)에 맞춰 터지도록 표시용 레벨을 추적한다.
  const levelUpEvent = useLevelUpDetector(displayedLevel ?? undefined);

  // 진입 시점의 값을 한 번만 고정한다.
  useEffect(() => {
    if (displayedLevel !== null || !puppyInfo) return;
    setDisplayedLevel(puppyInfo.puppyLevel ?? 0);
    setDisplayedPercent(puppyInfo.puppyLevelPercent ?? 0);
  }, [puppyInfo, displayedLevel]);

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, []);

  // 스텝이 바뀌면 이전 대상의 좌표에 복제본이 잠깐 그려지지 않도록 먼저 비운다.
  // (재측정만 하는 layoutTick 변화에서는 비우지 않아야 깜빡이지 않는다)
  useEffect(() => {
    setRect(null);
  }, [step]);

  // ===== 스포트라이트 대상 측정 =====
  // Figma의 393x852 절대좌표를 옮기지 않고 실제 렌더된 위치를 재서, 기기 폭과
  // 노치가 달라져도 스포트라이트와 말풍선이 따라가게 한다.
  useEffect(() => {
    const target =
      step === 1
        ? recordButtonRef
        : step === 2
          ? yesterdayButtonRef
          : step === 5
            ? topBarRef
            : null;

    if (!target) return;

    let cancelled = false;
    let frame = 0;

    // 스텝 전환으로 버튼 행이 늘어난 직후라, 레이아웃이 확정될 때까지 두 프레임 기다린다.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        target.current?.measureInWindow((x, y, width, height) => {
          if (cancelled || (!width && !height)) return;
          setRect({ x, y, width, height });
        });
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [step, layoutTick]);

  // ===== 4번 → 5번 자동 진행 =====
  // 기록 응답과 puppyInfo 리페치가 모두 끝난 뒤에 넘어가야, 5번에서 게이지가 멈춰 있는
  // 채로 "경험치가 올라갔어요!"가 뜨는 상황을 피할 수 있다.
  useEffect(() => {
    if (step !== 4 || !recordDone || isFetching) return;

    const elapsed = Date.now() - step4StartedAtRef.current;
    const timer = setTimeout(
      () => setStep(5),
      Math.max(0, STEP4_HOLD_MS - elapsed),
    );
    return () => clearTimeout(timer);
  }, [step, recordDone, isFetching]);

  // ===== 5번에서 경험치 공개 =====
  useEffect(() => {
    if (step !== 5 || revealedRef.current) return;
    revealedRef.current = true;

    const timer = setTimeout(() => {
      setDisplayedLevel(puppyInfo?.puppyLevel ?? 0);
      setDisplayedPercent(puppyInfo?.puppyLevelPercent ?? 0);
    }, XP_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, puppyInfo]);

  const handleRecordButton = useCallback(() => {
    logButtonTap('tutorial_drink_record');
    setStep(2);
  }, []);

  const handleYesterdayButton = useCallback(() => {
    logButtonTap('tutorial_record_yesterday');
    setStep(3);
  }, []);

  const handleRecord = useCallback(
    async (didDrink: boolean) => {
      if (recordingRef.current) return;
      recordingRef.current = true;

      step4StartedAtRef.current = Date.now();
      setStep(4);

      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      setReaction(didDrink ? 'angry' : 'heart');
      reactionTimerRef.current = setTimeout(() => setReaction('normal'), 2000);

      const drinkDate = new Date();
      drinkDate.setDate(drinkDate.getDate() - 1); // 튜토리얼은 '어제' 기록으로 안내한다
      const formattedDate = `${drinkDate.getFullYear()}-${String(drinkDate.getMonth() + 1).padStart(2, '0')}-${String(drinkDate.getDate()).padStart(2, '0')}`;

      try {
        await createDrinkHistoryMutation.mutateAsync({
          drinkDate: formattedDate,
          isDrink: didDrink,
        });
      } catch (error) {
        // 실패해도 튜토리얼은 끝까지 진행시킨다. (홈에서 다시 기록할 수 있다)
        console.error('튜토리얼 음주 기록 처리 중 오류 발생:', error);
      } finally {
        setRecordDone(true);
      }
    },
    [createDrinkHistoryMutation],
  );

  const handleFinish = useCallback(() => {
    logButtonTap('tutorial_finish');
    router.replace('/home');
  }, []);

  // 진입 값이 확정되기 전에는 그리지 않는다. (홈과 동일한 처리)
  if (displayedLevel === null || displayedPercent === null) return null;

  const displayName = puppyInfo?.puppyLevelName ?? '';
  const dimmed = step === 1 || step === 2 || step === 5 || step === 6;
  const recordMode = step >= 2;

  // 대상이 화면 오른쪽 절반에 있으면 말풍선도 오른쪽으로 붙인다.
  const tooltipAlign: 'left' | 'right' =
    rect && rect.x + rect.width / 2 > SCREEN_WIDTH / 2 ? 'right' : 'left';
  const tooltipPlacement: 'above' | 'below' = step === 5 ? 'below' : 'above';

  const messageKey =
    step === 3 ? 'archiveYesterday' : step === 4 ? 'archiveSuccess' : null;

  const renderSpotlightClone = () => {
    if (step === 1) {
      return (
        <IconButton
          icon={<CalendarVIcon width={24} height={24} />}
          text='음주 기록 할래!'
          variant='primary'
          onPress={handleRecordButton}
        />
      );
    }
    if (step === 2) {
      return (
        <IconButton
          icon={<CalendarYesterdayIcon width={24} height={24} />}
          text='어제 거 기록할래!'
          variant='primary'
          onPress={handleYesterdayButton}
        />
      );
    }
    if (step === 5) {
      return (
        <View pointerEvents='none'>
          <TopBar
            level={displayedLevel}
            displayName={displayName}
            percent={displayedPercent}
            levelUpEvent={levelUpEvent}
          />
        </View>
      );
    }
    return null;
  };

  const renderTooltip = () => {
    if (step === 1) {
      return (
        <CoachTooltip
          title='음주 기록 할래!'
          description={'매일 술 마셨는지 기록해요\n기록할수록 강아지가 성장해요'}
          action='아래 버튼을 눌러주세요'
          placement={tooltipPlacement}
          align={tooltipAlign}
        />
      );
    }
    if (step === 2) {
      return (
        <CoachTooltip
          title='음주 기록 할래!'
          description={'어제, 오늘 음주를 했는지\n기록을 시작해보세요!'}
          action='아래 버튼을 눌러주세요'
          placement={tooltipPlacement}
          align={tooltipAlign}
        />
      );
    }
    if (step === 5) {
      return (
        <CoachTooltip
          title='음주 기록 성공'
          description={'경험치가 올라갔어요!\n강아지를 성장시켜 보세요!'}
          placement={tooltipPlacement}
          align={tooltipAlign}
        />
      );
    }
    return null;
  };

  return (
    <ImageBackground
      source={require('../assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <SafeAreaView
        style={styles.background}
        className='flex flex-column justify-between items-center'
      >
        {/* ===== 상단 진행 바 =====
            SafeAreaView가 items-center라 래퍼에 w-full이 없으면 TopBar가 콘텐츠 폭으로
            줄어들어 레벨 카드가 찌그러진다. w-full을 반드시 유지할 것.
            튜토리얼 중 캘린더/설정으로 빠져나가지 못하도록 탭을 막는다. */}
        <View ref={topBarRef} collapsable={false} className='w-full'>
          <View pointerEvents='none'>
            <TopBar
              level={displayedLevel}
              displayName={displayName}
              percent={displayedPercent}
              levelUpEvent={levelUpEvent}
            />
          </View>
        </View>

        <ThemedView className='flex-1 w-full h-full px-4 bg-transparent'>
          {/* ===== 강아지 말풍선 ===== */}
          <View className='justify-center pt-4 h-20 bg-transparent'>
            {!!messageKey && (
              <View className='absolute top-0 w-full'>
                <SpeechBubble>{PUPPY_MESSAGES[messageKey]}</SpeechBubble>
              </View>
            )}
          </View>

          <ThemedView className='flex-1 w-full h-full flex-column justify-between justify-end bg-transparent'>
            {/* ===== 음주 여부 선택 ===== */}
            {step === 3 && (
              <ThemedView
                className='bg-transparent rounded-xl pb-3'
                style={{ width: '100%', zIndex: 10 }}
              >
                <ThemedView
                  className='flex-row mb-2 bg-transparent'
                  style={{ justifyContent: 'flex-start' }}
                >
                  <SpeechBubble
                    variant='user'
                    onPress={() => handleRecord(true)}
                  >
                    술 마셨어!
                  </SpeechBubble>
                  <ThemedView className='w-[10px] bg-transparent' />
                  <SpeechBubble
                    variant='user'
                    onPress={() => handleRecord(false)}
                  >
                    술 안 마셨어!
                  </SpeechBubble>
                </ThemedView>
              </ThemedView>
            )}

            {/* ===== 하단 버튼 =====
                실제 탭은 전부 오버레이의 복제본이 받는다. 여기 버튼은 배경 역할이라
                탭을 막아 스텝을 벗어나는 조작이 생기지 않게 한다. */}
            <ThemedView
              className='justify-end w-full h-40 bg-transparent pb-4'
              pointerEvents='none'
            >
              <ThemedView
                className='flex-col p-5 px-4 border border-gray-200 rounded-2xl bg-cream-200'
                onLayout={() => setLayoutTick((tick) => tick + 1)}
              >
                <ThemedView className='flex-row justify-between bg-transparent'>
                  {recordMode && (
                    <View
                      className='flex-row justify-between flex-1 mb-4 bg-transparent'
                      style={{ columnGap: 8 }}
                    >
                      <View
                        ref={yesterdayButtonRef}
                        collapsable={false}
                        className='flex-1'
                      >
                        <IconButton
                          icon={<CalendarYesterdayIcon width={24} height={24} />}
                          text='어제 거 기록할래!'
                          variant='lightgreen'
                        />
                      </View>
                      <IconButton
                        icon={<CalendarTodayIcon width={24} height={24} />}
                        text='오늘 기록할래!'
                        variant='lightgreen'
                      />
                    </View>
                  )}
                </ThemedView>

                <ThemedView
                  className='flex-row justify-between bg-transparent'
                  style={{ columnGap: 8 }}
                >
                  <IconButton
                    icon={<MessageIcon width={24} height={24} />}
                    text='나한테 한마디만 해줘'
                  />
                  <View
                    ref={recordButtonRef}
                    collapsable={false}
                    className='flex-1'
                  >
                    <IconButton
                      icon={<CalendarVIcon width={24} height={24} />}
                      text='음주 기록 할래!'
                      variant={recordMode ? 'primary' : 'ghost'}
                    />
                  </View>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* ===== 강아지 ===== */}
        <View pointerEvents='none' style={styles.gifLayer}>
          <EvolvingPuppy
            breedName={displayName}
            level={displayedLevel}
            reaction={reaction}
            evolveEvent={levelUpEvent}
            size={288}
          />
        </View>

        <LevelUpBadge trigger={levelUpEvent?.id ?? 0} />

        {/* ===== 코치마크 오버레이 ===== */}
        <TutorialOverlay
          visible={dimmed}
          rect={step === 6 ? null : rect}
          tooltip={renderTooltip()}
          tooltipPlacement={tooltipPlacement}
          tooltipAlign={tooltipAlign}
          onPressBackdrop={step === 5 ? () => setStep(6) : undefined}
          centerContent={
            step === 6 ? <TutorialFinishCard onStart={handleFinish} /> : null
          }
        >
          {renderSpotlightClone()}
        </TutorialOverlay>
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
  gifLayer: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
