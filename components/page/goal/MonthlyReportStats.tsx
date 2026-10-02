import { StyleSheet, Text, View } from 'react-native';

type MonthlyReportStatsProps = {
  /** 리포트 대상 월 (1~12) */
  month: number;
  /** 그 달에 술 마신 날 수 */
  drinkDays: number;
  /** 그 달의 목표 음주 횟수 */
  goal: number;
};

/**
 * 월간 리포트 하단의 통계 카드 두 개. (술 마신 날 · N월 목표)
 * 목표 갱신 화면의 리포트 스텝에서 GoalCounter 자리에 들어간다.
 */
export function MonthlyReportStats({
  month,
  drinkDays,
  goal,
}: MonthlyReportStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard label='술 마신 날' value={`${drinkDays}일`} />
      <StatCard label={`${month}월 목표`} value={`${goal}번`} />
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chip}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: '#E4FAE8',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0FD380',
  },
});
