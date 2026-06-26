import CalendarIcon from '@/assets/icons/home/ic_calendar.svg';
import SettingIcon from '@/assets/icons/home/ic_cogwheel.svg';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LevelUpEvent } from '@/hooks/home/useLevelUpDetector';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  level: number;
  displayName: string;
  percent: number;
  levelUpEvent?: LevelUpEvent | null;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// 일반(레벨업 아님) percent 변화 시 부드럽게 따라가는 시간
const SMOOTH_MS = 500;
// 레벨업 연출: 현재→100% 채움 / 0%→새 percent 채움
const FILL_UP_MS = 600;
const FILL_NEW_MS = 800;

export function TopBar({ level, displayName, percent, levelUpEvent }: Props) {
  // 바 채움 정도(0~100). 퍼센트 숫자 텍스트도 이 값을 따라간다.
  const progress = useSharedValue(percent);
  // 레벨 숫자는 바가 100%에 닿는 순간 갱신되어야 하므로 별도 상태로 관리
  const [displayLevel, setDisplayLevel] = useState(level);
  // 레벨업 연출 진행 중에는 일반 percent 동기화가 개입하지 않도록 가드
  const animatingRef = useRef(false);
  const lastEventIdRef = useRef(0);

  // 레벨업 연출: 현재값 → 100% → (레벨 갱신·0으로 리셋) → 새 percent
  useEffect(() => {
    if (!levelUpEvent || levelUpEvent.id === lastEventIdRef.current) return;
    lastEventIdRef.current = levelUpEvent.id;
    animatingRef.current = true;

    const toLevel = levelUpEvent.toLevel;
    const newPercent = percent;

    progress.value = withSequence(
      withTiming(
        100,
        { duration: FILL_UP_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setDisplayLevel)(toLevel);
        },
      ),
      withTiming(0, { duration: 0 }),
      withTiming(
        newPercent,
        { duration: FILL_NEW_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setAnimatingDone)();
        },
      ),
    );

    function setAnimatingDone() {
      animatingRef.current = false;
    }
  }, [levelUpEvent, percent, progress]);

  // 일반 동기화: 레벨업 연출 중이 아니면 레벨/퍼센트를 부드럽게 반영
  useEffect(() => {
    if (animatingRef.current) return;
    setDisplayLevel(level);
    progress.value = withTiming(percent, {
      duration: SMOOTH_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [level, percent, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const percentProps = useAnimatedProps(() => {
    // reanimated의 TextInput text 애니메이션은 공식적으로 캐스팅이 필요한 패턴
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { text: `${Math.round(progress.value)}%` } as any;
  });

  return (
    <ThemedView className='relative flex-row justify-between gap-6 px-4 pt-6 bg-transparent'>
      {/* 좌측 컴포넌트바 */}
      <ThemedView className='flex-1 px-4 py-3 rounded-2xl bg-cream-200'>
        <ThemedView className='flex-row items-center mb-2 bg-transparent'>
          <ThemedView className='bg-green-500 px-2 py-1 rounded-full'>
            <ThemedText className='text-white text-xs font-semibold'>
              Level {displayLevel}
            </ThemedText>
          </ThemedView>
          <ThemedText className='ml-2 text-sm text-gray-600'>
            {displayName}
          </ThemedText>
          <AnimatedTextInput
            editable={false}
            pointerEvents='none'
            underlineColorAndroid='transparent'
            defaultValue={`${Math.round(percent)}%`}
            animatedProps={percentProps}
            style={{
              marginLeft: 'auto',
              padding: 0,
              color: '#21D08A',
              fontSize: 12,
              fontWeight: '700',
              textAlign: 'right',
            }}
          />
        </ThemedView>
        <ThemedView className='bg-green-100 h-2 rounded-full overflow-hidden'>
          <Animated.View
            className='bg-green-500 h-2 rounded-full'
            style={barStyle}
          />
        </ThemedView>
      </ThemedView>

      {/* 원형 아이콘 */}
      <ThemedView className='flex-row ml-4 gap-x-2.5 bg-transparent'>
        <TouchableOpacity
          className='w-10 h-10 justify-center items-center bg-white rounded-full shadow-sm'
          onPress={() => router.push('/calendar')}
        >
          <CalendarIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          className='w-10 h-10 justify-center items-center bg-white rounded-full shadow-sm'
          onPress={() => {
            router.push('/setting');
          }}
        >
          <SettingIcon width={20} height={20} color='#10B981' />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
