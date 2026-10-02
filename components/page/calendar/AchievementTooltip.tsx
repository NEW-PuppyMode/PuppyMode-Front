import TooltipTail from '@/assets/icons/calendar/tooltip_tail.svg';
import React from 'react';
import { Text, View } from 'react-native';

// 꼬리 SVG의 가로 길이. 꼭짓점이 가운데라 절반만큼 왼쪽으로 당겨 tailCenterX에 맞춘다.
const TAIL_WIDTH = 20.7384;

interface AchievementTooltipProps {
  // 칩 줄 왼쪽 끝 기준, 꼬리 꼭짓점이 올 x 좌표 (정보 아이콘 가운데)
  tailCenterX: number;
}

/**
 * 달성 확률 칩의 정보 아이콘을 눌렀을 때 칩 줄 아래에 뜨는 말풍선.
 * 칩 줄(position: relative) 안에 absolute로 놓여 달력 위를 덮는다.
 */
export default function AchievementTooltip({
  tailCenterX,
}: AchievementTooltipProps) {
  return (
    <>
      <View
        className='absolute w-[264px] right-5 top-[56px] bg-[#E4FAE8] rounded-[15px] px-4 py-3'
        style={{ gap: 4 }}
      >
        <Text className='text-[14px] leading-[22px] font-bold text-[#00A775]'>
          달성 확률은 어떻게 나왔나요?
        </Text>
        <Text
          className='text-[12px] font-medium text-[#19BC77]'
          style={{ lineHeight: 12 * 1.4, letterSpacing: -0.24 }}
        >
          지금까지의 기록과 남은 날짜를 바탕으로, 목표를 지킬 수 있을지
          알려드려요.
        </Text>
      </View>
      <View
        className='absolute top-[45.58px]'
        style={{ left: tailCenterX - TAIL_WIDTH / 2 }}
      >
        <TooltipTail />
      </View>
    </>
  );
}
