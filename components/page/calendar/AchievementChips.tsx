import GoalsIcon from '@/assets/icons/calendar/ic_goals.svg';
import InfoIcon from '@/assets/icons/calendar/ic_info.svg';
import type { ReportResultDTO } from '@/services/reportData';
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';
import AchievementTooltip from './AchievementTooltip';

const COLORS = {
  green: { main: '#0FD380', sub: '#E4FAE8', subText: '#19BC77' },
  red: { main: '#FE877C', sub: '#FFF1F1', subText: '#FE877C' },
};

// 오른쪽 칩의 오른쪽 패딩(12) + 정보 아이콘 절반(6). 칩 오른쪽 끝에서 아이콘 가운데까지 거리
const INFO_ICON_CENTER_FROM_RIGHT = 18;

interface AchievementChipsProps {
  report: Pick<
    ReportResultDTO,
    'goal' | 'drinkDays' | 'achievementRate' | 'goalStatus'
  >;
  isTooltipOpen: boolean;
  onToggleTooltip: () => void;
}

/**
 * 캘린더 월 제목 아래의 목표 칩 두 개.
 * - IN_PROGRESS: 목표 N번 · 달성 확률 N% (정보 아이콘을 누르면 설명 말풍선)
 * - ACHIEVED / FAILED: 목표 달성 성공!/실패 · 마신 날/목표
 * NO_GOAL이면 아무것도 그리지 않는다.
 */
export default function AchievementChips({
  report,
  isTooltipOpen,
  onToggleTooltip,
}: AchievementChipsProps) {
  // 말풍선 꼬리를 정보 아이콘 아래에 맞추려고 오른쪽 칩 위치를 잰다.
  const [tailCenterX, setTailCenterX] = useState<number | null>(null);
  const handleSubChipLayout = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTailCenterX(x + width - INFO_ICON_CENTER_FROM_RIGHT);
  };

  const { goal, drinkDays, achievementRate, goalStatus } = report;
  if (goalStatus === 'NO_GOAL') return null;

  const isInProgress = goalStatus === 'IN_PROGRESS';
  const color = goalStatus === 'FAILED' ? COLORS.red : COLORS.green;
  const mainLabel = isInProgress
    ? `목표 ${goal}번`
    : goalStatus === 'ACHIEVED'
      ? '목표 달성 성공!'
      : '목표 달성 실패';

  const subChipContent = isInProgress ? (
    <>
      <Text
        className='text-[14px] leading-[22px] font-bold'
        style={{ color: color.subText }}
      >
        달성 확률 {achievementRate}%
      </Text>
      <InfoIcon />
    </>
  ) : (
    <Text
      className='text-[14px] leading-[22px] font-bold'
      style={{ color: color.subText }}
    >
      {drinkDays}/{goal}번 마심
    </Text>
  );

  return (
    // NativeWind v2의 gap-*은 부모 박스를 밀어내서 네이티브 gap을 쓴다. (app/calendar.tsx 참고)
    <View className='flex-row items-center px-6' style={{ gap: 8 }}>
      <View
        className='flex-row items-center px-3 py-2 rounded-full'
        style={{ gap: 4, backgroundColor: color.main }}
      >
        {/* 아이콘 프레임은 20×20, 그림은 16.2×16.2로 안쪽에 들어가 있다 */}
        <View className='w-5 h-5 pl-[2.3px] pt-[2.3px]'>
          <GoalsIcon />
        </View>
        <Text className='text-[14px] leading-[22px] font-bold text-[#FBFFFC]'>
          {mainLabel}
        </Text>
      </View>

      {isInProgress ? (
        <TouchableOpacity
          className='flex-row items-center px-3 py-2 rounded-full'
          style={{ gap: 4, backgroundColor: color.sub }}
          onLayout={handleSubChipLayout}
          onPress={onToggleTooltip}
        >
          {subChipContent}
        </TouchableOpacity>
      ) : (
        <View
          className='flex-row items-center px-3 py-2 rounded-full'
          style={{ backgroundColor: color.sub }}
        >
          {subChipContent}
        </View>
      )}

      {isInProgress && isTooltipOpen && tailCenterX !== null && (
        <AchievementTooltip tailCenterX={tailCenterX} />
      )}
    </View>
  );
}
