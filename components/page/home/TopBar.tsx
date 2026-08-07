import CalendarIcon from '@/assets/icons/home/ic_calendar.svg';
import SettingIcon from '@/assets/icons/home/ic_cogwheel.svg';
import { ProgressCard } from '@/components/page/home/ProgressCard';
import { ThemedView } from '@/components/ThemedView';
import { LevelUpEvent } from '@/hooks/home/useLevelUpDetector';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface Props {
  level: number;
  displayName: string;
  percent: number;
  levelUpEvent?: LevelUpEvent | null;
}

export function TopBar({ level, displayName, percent, levelUpEvent }: Props) {
  return (
    // NativeWind v2의 gap-*은 "부모에 음수 마진 + 자식에 양수 마진"으로 흉내 내는 방식이라
    // 부모 박스가 위/왼쪽으로 밀려나고 그만큼 넓어진다. RN 0.79는 gap을 네이티브로 지원하므로
    // 인라인 스타일로 준다. (보이는 간격은 동일)
    <ThemedView
      className='relative flex-row justify-between px-4 pt-6 bg-transparent'
      style={{ gap: 24 }}
    >
      {/* 좌측 컴포넌트바 */}
      <ProgressCard
        level={level}
        displayName={displayName}
        percent={percent}
        levelUpEvent={levelUpEvent}
      />

      {/* 원형 아이콘 */}
      <ThemedView
        className='flex-row ml-4 bg-transparent'
        style={{ columnGap: 10 }}
      >
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
