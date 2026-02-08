import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error?.message ?? error) };
  }

  componentDidCatch(error: any, info: any) {
    // 핵심: componentStack이 범인 컴포넌트 추적에 도움됨
    console.log('[ErrorBoundary] error:', error);
    console.log('[ErrorBoundary] componentStack:', info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            앱 오류가 발생했습니다.
          </Text>
          <Text style={{ marginTop: 8 }}>{this.state.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
