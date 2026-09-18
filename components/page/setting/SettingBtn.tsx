import RightArrowIcon from '@/assets/icons/setting/ic_right_arrow.svg';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingBtnProps {
  title: string;
  onPress: () => void;
  /** 우측 화살표 앞에 함께 보여줄 현재 값. e.g. 이름 행의 '정현우' */
  value?: string;
}

const SettingBtn = ({ title, onPress, value }: SettingBtnProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
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
    borderBottomColor: '#F1F1F1',
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
