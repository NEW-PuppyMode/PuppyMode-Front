/* eslint-disable @typescript-eslint/no-require-imports */
import CalendarIcon from '@/assets/icons/home/ic_calendar.svg';
import { Image as ExpoImage } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LOGO = require('@/assets/images/home/tutorial_logo.png');

/**
 * 튜토리얼 마지막 스텝의 기능 예고 카드.
 *
 * RN Modal(DefaultModal)을 쓰지 않고 TutorialOverlay의 딤 위에 그대로 얹는다.
 * Modal을 띄우면 자체 backdrop이 겹쳐 딤이 두 겹이 되거나, 기존 딤을 끄는 순간
 * 밝아졌다 다시 어두워지는 깜빡임이 생긴다. 딤을 계속 유지하는 편이 매끄럽다.
 */

type Props = {
  onStart: () => void;
};

export function TutorialFinishCard({ onStart }: Props) {
  return (
    <View style={styles.card}>
      <ExpoImage source={LOGO} style={styles.logo} contentFit='contain' />

      <Text style={styles.title}>앞으로 이런 것도 할 수 있어요!</Text>
      <Text style={styles.subtitle}>기록할수록 데이터가 채워져요 👀</Text>

      <View style={styles.featureRow}>
        <View style={styles.feature}>
          <View style={styles.featureHeader}>
            <CalendarIcon width={20} height={20} />
            <Text style={styles.featureLabel}>음주 캘린더</Text>
          </View>
          <Text style={styles.featureBody}>
            한달 기록을 한눈에{'\n'}
            <Text style={styles.featureBodyMuted}>빨강 = 음주, 초록 = 금주</Text>
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureHeader}>
            <ReportIcon />
            <Text style={styles.featureLabel}>음주 리포트</Text>
          </View>
          <Text style={styles.featureBody}>
            목표 달성률, 음주 횟수{'\n'}이번 달 나를 돌아봐요
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={onStart}
        activeOpacity={0.75}
      >
        <Text style={styles.ctaText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * 막대그래프 아이콘. 디자인에서도 벡터가 아니라 테두리를 준 사각형 3개라서
 * 에셋을 만들지 않고 같은 도형으로 그린다.
 */
function ReportIcon() {
  return (
    <View style={styles.reportIcon}>
      <View style={[styles.reportBar, { left: 3, top: 6, height: 12 }]} />
      <View style={[styles.reportBar, { left: 8.63, top: 10, height: 8 }]} />
      <View style={[styles.reportBar, { left: 14.25, top: 3, height: 15 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 336,
    maxWidth: '92%',
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  logo: {
    width: 36,
    height: 36,
    alignSelf: 'center',
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.54,
    color: '#555555',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#777777',
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#EAEAEA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: '#3C3C3C',
  },
  featureBody: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#3C3C3C',
    textAlign: 'center',
  },
  featureBodyMuted: {
    color: '#868686',
  },
  reportIcon: {
    width: 20,
    height: 20,
  },
  reportBar: {
    position: 'absolute',
    width: 3.75,
    borderWidth: 1,
    borderColor: '#0FD380',
    borderRadius: 1,
  },
  cta: {
    height: 48,
    marginTop: 25,
    borderRadius: 5,
    backgroundColor: '#0FD380',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F2FFF4',
  },
});
