import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  value: string;
};

export function TextInput({ value, ...props }: Props) {
  const placeholderTextColor = useThemeColor(
    { light: '#BABABA', dark: '#777777' },
    'text',
  );

  const baseClass = `
    rounded-3xl
    px-4
    py-3
    text-[16px]
    font-pretendard
  `;

  const valueClass = value.trim()
    ? 'bg-green-100 text-green-900 border border-green-500 '
    : 'bg-white text-grayscale-950';

  return (
    <RNTextInput
      {...props}
      value={value}
      placeholderTextColor={placeholderTextColor}
      className={`${baseClass} ${valueClass}`}
      maxLength={10}
    />
  );
}
