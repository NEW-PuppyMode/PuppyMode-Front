import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type ChoiceButtonProps = {
  label: string;
  onPress?: () => void;
  /*  
    variant = 'primary' → 채도 높은 초록 테두리 (작성 완료)
    variant = 'ghost'   → 옅은 회색 테두리   (취소)
  */
  variant?: 'primary' | 'ghost';
};

export function ChoiceButton({
  label,
  onPress,
  variant = 'ghost',
}: ChoiceButtonProps) {
  const base = 'px-2 py-3 rounded-xl items-center justify-center min-w-[88px]'; // 디자인 고정 크기
  const variants = {
    primary: 'border border-green-500 bg-white',
    ghost: 'border border-grayscale-200 bg-white bg-opacity-50',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${base} ${variants[variant]}`}
    >
      <ThemedText
        className={
          variant === 'primary'
            ? 'text-green-600 font-semibold text-[15px]'
            : 'text-grayscale-600 font-medium text-[15px]'
        }
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
