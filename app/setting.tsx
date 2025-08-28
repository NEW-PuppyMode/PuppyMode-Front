import SettingBtn from '@/components/page/setting/SettingBtn';
import { StyleSheet, Text, View } from 'react-native';

const Setting = () => {
  return (
    <View style={styles.container}>
      <SettingBtn title='이용약관' onPress={() => {}} />
      <SettingBtn title='개인정보 처리방침' onPress={() => {}} />
      <SettingBtn title='탈퇴하기' onPress={() => {}} />
      <SettingBtn title='로그아웃' onPress={() => {}} />
      <View style={styles.view}>
        <Text style={styles.text}>앱 버전</Text>
        <Text style={styles.text}>1.0.0</Text>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
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
