import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeErrorViewProps = {
  onRetry: () => void;
  /** 재시도 요청 중에는 버튼을 막아 중복 요청을 방지한다. */
  isRetrying: boolean;
};

/**
 * 홈 데이터(/main)를 불러오지 못했을 때 보여주는 화면.
 *
 * 인증 실패는 앱 진입 시 index(/auth/me)에서 이미 로그인 화면으로 보내므로,
 * 여기까지 오는 실패는 대부분 일시적인 네트워크·서버 문제다. 그래서 로그인
 * 화면으로 보내지 않고 다시 시도만 제공한다.
 */
export function HomeErrorView({ onRetry, isRetrying }: HomeErrorViewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.middle}>
        <Text style={styles.title}>정보를 불러오지 못했어요</Text>
        <Text style={styles.subtitle}>
          네트워크 연결을 확인한 뒤 다시 시도해주세요.
        </Text>
      </View>
      <View style={styles.bottom}>
        <PrimaryButton
          title={isRetrying ? '불러오는 중...' : '다시 시도'}
          onPress={onRetry}
          disabled={isRetrying}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 32,
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: '#777777',
  },
  bottom: {
    paddingVertical: 14,
  },
});
