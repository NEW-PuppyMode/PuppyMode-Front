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
};

export function IconButton({
  iconName,
  iconColor = '#10B981',
  text,
  onPress,
  variant = 'ghost',
}: IconButtonProps) {
  const baseContainer =
    'flex-row p-2 rounded-2xl shadow-sm flex-1 items-center';
  const containerVariants = {
    primary: 'bg-green-100 border border-green-500',
    lightgreen: 'bg-green-000 border border-green-warm-100',
    ghost: 'bg-white border border-gray-200',
  };
  const baseText =
    'flex-1 flex-shrink-0 font-pretendard text-[12px] font-medium text-center';
  const textVariants = {
    primary: 'text-green-600',
    lightgreen: 'text-green-950',
    ghost: 'text-gray-600 opacity-60',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`${baseContainer} ${containerVariants[variant]}`}
    >
      <Ionicons name={iconName} size={20} color={iconColor} />
      <ThemedText className={`${baseText} ${textVariants[variant]}`}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}
