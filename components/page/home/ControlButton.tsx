import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type ControlButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export function ControlButton({
  label,
  onPress,
  variant = 'ghost',
  style,
  className,
}: ControlButtonProps) {
  const base = 'rounded-full items-center justify-center w-10 h-10 shadow-lg';
  const variants = {
    primary: 'border border-green-500 bg-white',
    ghost: 'border border-grayscale-200 bg-white bg-opacity-50',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${base} ${variants[variant]} ${className}`}
      style={style}
    >
      <ThemedText
        className={
          variant === 'primary'
            ? 'text-green-600 font-semibold text-[15px]'
            : 'text-green-500 font-medium text-[23px]'
        }
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
