import { StyleSheet, Text, View } from 'react-native';

/** 설정 화면의 그룹 제목. e.g. '내 프로필', '일반' */
export const SettingSectionHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

/** 설정 그룹 사이를 갈라주는 회색 띠 */
export const SettingDivider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    color: '#A3A3A3',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17.62,
  },
  divider: {
    width: '100%',
    height: 12,
    backgroundColor: '#F8F8F8',
  },
});
