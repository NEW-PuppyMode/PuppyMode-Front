import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type ChoiceButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function ChoiceButton({
  label,
  onPress,
  variant = 'ghost',
  style,
}: ChoiceButtonProps) {
  const base = 'px-3 py-3 rounded-xl items-center justify-center min-w-[64px]';
  const variants = {
    primary: 'border border-green-500 bg-white',
    ghost: 'border border-grayscale-200 bg-white bg-opacity-50',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${base} ${variants[variant]}`}
      style={style}
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
