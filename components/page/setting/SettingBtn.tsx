import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SettingBtnProps {
  title: string;
  onPress: () => void;
}

const SettingBtn = ({ title, onPress }: SettingBtnProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
      <Image source={require('@/assets/icons/setting/ic_right_arrow.svg')} />
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
  text: {
    color: '#282828',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});
