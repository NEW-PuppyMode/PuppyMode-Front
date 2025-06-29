// BaseButton.tsx
import {typographyMap, TypographyType} from '@/styles/theme/typography';
import {styled} from 'nativewind';
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

interface BaseButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  variant?: TypographyType;
}

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const BaseButton: React.FC<BaseButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'RegularSmall',
}) => {
  return (
    <StyledTouchableOpacity
      className={`
        w-full rounded-md py-4 px-6 items-center justify-center
        ${disabled ? 'bg-grayscale-300' : 'bg-green-500'}
        ${disabled ? 'opacity-50' : ''}
      `}
      style={style}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <StyledText
        className={`
          text-center
          ${disabled ? 'text-grayscale-50' : 'text-green-50'}
          ${typographyMap[variant]}
        `}
        style={textStyle}
      >
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default BaseButton;
