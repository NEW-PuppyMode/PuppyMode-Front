import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

type SpeechBubbleProps = {
  children: React.ReactNode;
  variant?: 'puppy' | 'user';
  onPress?: () => void;
  /** 지정 시 말풍선 최소 높이를 고정해, 줄 수가 달라도 높이를 일정하게 유지한다. */
  minHeight?: number;
};

export function SpeechBubble({
  children,
  variant = 'puppy',
  onPress,
  minHeight,
}: SpeechBubbleProps) {
  const bgColor =
    variant === 'puppy'
      ? 'w-full bg-cream-200 rounded-xl py-4'
      : 'bg-green-50 rounded-2xl px-8 py-3 shadow-sm';
  const tailColor = variant === 'puppy' ? '#FFFCF6' : '#F2FFF4';
  const textStyle =
    variant === 'puppy'
      ? 'text-gray-950 text-[20px] leading-7 font-bold text-center'
      : 'text-gray-950 text-sm leading-5 font-semibold text-center';

  const Content = (
    <Animated.View
      className={`${bgColor}`}
      style={minHeight ? { minHeight, justifyContent: 'center' } : undefined}
      entering={ZoomIn.duration(300).springify()}
    >
      <ThemedText className={textStyle}>{children}</ThemedText>
    </Animated.View>
  );

  return (
    <View className='items-center mt-8 mb-4'>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {Content}
        </TouchableOpacity>
      ) : (
        Content
      )}

      <Animated.View
        entering={FadeIn.duration(100).delay(100)}
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: tailColor,
          marginTop: -1,
        }}
      />
    </View>
  );
}
