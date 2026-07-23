import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  /** 화면별 여백 등 위치 조정용 (여백은 각 화면에서 주입한다) */
  style?: StyleProp<ViewStyle>;
};

/**
 * 전체 화면 플로우(온보딩 · 강아지 입양 테스트)에서 공통으로 쓰는
 * 하단 CTA 버튼. 높이 60 · radius 10 · 초록 배경.
 * 위치/여백은 각 화면의 래퍼에서 담당하고, 필요하면 style로 덮어쓴다.
 */
export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#0FD380',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#C1C1C1',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F2FFF4',
  },
  buttonTextDisabled: {
    color: '#F1F1F1',
  },
});
