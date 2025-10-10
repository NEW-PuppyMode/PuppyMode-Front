import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type IconButtonProps = {
  icon?: React.ReactNode;
  iconColor?: string;
  text: string;
  onPress?: () => void;
  variant?: 'primary' | 'lightgreen' | 'ghost';
  disabled?: boolean;
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  text,
  onPress,
  variant = 'ghost',
  disabled = false,
  containerClassName,
  style,
}: IconButtonProps) {
  const baseContainer = 'flex-row p-2 rounded-xl flex-1 items-center';

  const containerVariants = {
    primary: disabled
      ? 'bg-green-100 border border-green-300 opacity-50'
      : 'bg-green-100 border border-green-500',
    lightgreen: disabled
      ? 'bg-green-000 border border-green-warm-100 opacity-50'
      : 'bg-green-000 border border-green-warm-100',
    ghost: disabled
      ? 'bg-white border border-gray-200 opacity-50'
      : 'bg-white border border-gray-200',
  };

  const baseText =
    'flex-1 flex-shrink-0 font-pretendard text-[12px] font-medium ml-1 text-left';

  const textVariants = {
    primary: disabled ? 'text-green-300' : 'text-green-600',
    lightgreen: disabled ? 'text-green-300' : 'text-green-950',
    ghost: disabled ? 'text-gray-300' : 'text-gray-950 opacity-60',
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      className={`${baseContainer} ${containerVariants[variant]} ${containerClassName}`}
      style={style}
      disabled={disabled}
    >
      {icon}

      <ThemedText className={`${baseText} ${textVariants[variant]}`}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}
