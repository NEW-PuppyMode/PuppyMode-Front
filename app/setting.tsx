import DefaultModal from '@/components/common/DefaultModal';
import PolicyModal from '@/components/page/setting/PolicyModal';
import SettingBtn from '@/components/page/setting/SettingBtn';
import { POLICY_MESSAGES } from '@/constants/messages';
import { useAuth } from '@/contexts/AuthContext';
import { PUPPY_QUERY_KEYS } from '@/hooks/queries/usePuppyInfoQuery';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {
  const queryClient = useQueryClient();
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    'terms_of_uses' | 'privacy_policies'
  >('terms_of_uses');

  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

  const { logout } = useAuth();

  // useEffect(() => {
  //   crashlytics().log('screen: /setting mounted');
  // }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 48,
          paddingHorizontal: 8,
          paddingVertical: 16,
          width: '100%',
          height: 60,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          className='px-[8px]'
        >
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
        <View style={{ width: 40 }} />
      </View>

      <SettingBtn
        title='이용약관'
        onPress={() => {
          setPolicyModalVisible(true);
          setPolicyModalType('terms_of_uses');
        }}
      />
      <SettingBtn
        title='개인정보 처리방침'
        onPress={() => {
          setPolicyModalVisible(true);
          setPolicyModalType('privacy_policies');
        }}
      />
      <SettingBtn
        title='탈퇴하기'
        onPress={() => {
          router.push('/delete_account');
        }}
      />
      <SettingBtn
        title='로그아웃'
        onPress={() => {
          setSignOutModalVisible(true);
        }}
      />
      <View style={styles.view}>
        <Text style={styles.text}>앱 버전</Text>
        <Text style={styles.text}>1.0.3</Text>
      </View>

      <PolicyModal
        title={
          policyModalType === 'terms_of_uses' ? '이용약관' : '개인정보 처리방침'
        }
        content={POLICY_MESSAGES[policyModalType]}
        visible={policyModalVisible}
        setPolicyModalVisible={setPolicyModalVisible}
      />
      <DefaultModal
        visible={signOutModalVisible}
        setVisible={setSignOutModalVisible}
      >
        <View className='justify-between p-[15px] pt-[35px] w-[336px] h-[154px] bg-white rounded-[10px]'>
          <Text className='text-[#555] text-center font-semibold text-[18px]'>
            정말 로그아웃을 하시겠습니까?
          </Text>

          <View className='flex-row justify-between'>
            <TouchableOpacity
              onPress={async () => {
                setSignOutModalVisible(false);
                await logout();
                router.replace('/signin');

                queryClient.removeQueries({
                  queryKey: PUPPY_QUERY_KEYS.puppyInfo,
                });
              }}
              className='justify-center items-center w-[148px] h-[48px] border-[1px] border-[#0FD380] bg-white rounded-[5px]'
            >
              <Text className='text-[#0FD380] font-medium text-[12px]'>
                확인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='justify-center items-center w-[148px] h-[48px] bg-[#0FD380] rounded-[5px]'
              onPress={() => setSignOutModalVisible(false)}
            >
              <Text className='text-[#F2FFF4] font-medium text-[12px]'>
                취소
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DefaultModal>
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
