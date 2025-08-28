import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type IconButtonProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  text: string;
  onPress?: () => void;
  variant?: 'primary' | 'lightgreen' | 'ghost';
  disabled?: boolean;
};

export function IconButton({
  iconName,
  iconColor = '#10B981',
  text,
  onPress,
  variant = 'ghost',
  disabled = false,
}: IconButtonProps) {
  const baseContainer =
    'flex-row p-2 rounded-2xl shadow-sm flex-1 items-center';

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
    'flex-1 flex-shrink-0 font-pretendard text-[12px] font-medium text-center';

  const textVariants = {
    primary: disabled ? 'text-green-300' : 'text-green-600',
    lightgreen: disabled ? 'text-green-300' : 'text-green-950',
    ghost: disabled ? 'text-gray-300' : 'text-gray-600 opacity-60',
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      className={`${baseContainer} ${containerVariants[variant]}`}
      disabled={disabled}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={disabled ? '#A0A0A0' : iconColor}
      />
      <ThemedText className={`${baseText} ${textVariants[variant]}`}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}
