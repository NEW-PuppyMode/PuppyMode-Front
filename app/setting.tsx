import SettingBtn from '@/components/page/setting/SettingBtn';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 48,
          padding: 16,
          width: '100%',
          height: 60,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            className='w-[8px] h-[16px]'
            source={require('@/assets/images/chevron_left.png')}
            style={{ margin: 10 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
            color: '#282828',
          }}
        >
          설정
        </Text>
        <View style={{ width: 24 }} />
      </View>
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
