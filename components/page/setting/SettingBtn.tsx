import RightArrowIcon from '@/assets/icons/setting/ic_right_arrow.svg';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingBtnProps {
  title: string;
  onPress: () => void;
  /** 우측 화살표 앞에 함께 보여줄 현재 값. e.g. 이름 행의 '정현우' */
  value?: string;
  /** 그룹의 마지막 행이라 아래 구분선을 그리지 않을 때 */
  hideBorder?: boolean;
}

const SettingBtn = ({ title, onPress, value, hideBorder }: SettingBtnProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, hideBorder && styles.noBorder]}
    >
      <Text style={styles.text}>{title}</Text>
      <View style={styles.right}>
        {!!value && <Text style={styles.text}>{value}</Text>}
        <RightArrowIcon width={6} height={12} />
      </View>
    </TouchableOpacity>
  );
};

export default SettingBtn;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    color: '#282828',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});
