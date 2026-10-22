import { reportError } from '@/utils/tokenDebug';
import crashlytics from '@react-native-firebase/crashlytics';
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

    // ErrorBoundary가 잡으면 전역 핸들러까지 가지 않으므로 직접 올린다.
    // componentStack은 attribute 길이 제한을 넘기 쉬워 log로 남긴다.
    try {
      crashlytics().log(`componentStack: ${info?.componentStack ?? ''}`);
    } catch (e) {
      console.warn('[ErrorBoundary] crashlytics 로그 실패', e);
    }
    reportError(error, 'ErrorBoundary');
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
