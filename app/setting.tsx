import DefaultModal from '@/components/common/DefaultModal';
import PolicyModal from '@/components/page/setting/PolicyModal';
import SettingBtn from '@/components/page/setting/SettingBtn';
import { APP_VERSION } from '@/constants/appVersion';
import { POLICY_MESSAGES } from '@/constants/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useEnableNotifications } from '@/hooks/notifications/useEnableNotifications';
import {
  useNotificationSettingQuery,
  useUpdateNotificationSettingMutation,
} from '@/hooks/queries/useNotificationSettingQuery';
import { PUPPY_QUERY_KEYS } from '@/hooks/queries/usePuppyInfoQuery';
import { useQueryClient } from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Setting = () => {
  const queryClient = useQueryClient();
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<
    'terms_of_uses' | 'privacy_policies'
  >('terms_of_uses');

  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

  const { logout } = useAuth();
  const { data: notificationSetting } = useNotificationSettingQuery();
  const { mutate: updateNotificationSetting } =
    useUpdateNotificationSettingMutation();
  const { requestAndEnable } = useEnableNotifications();

  const [hasNotifPermission, setHasNotifPermission] = useState(false);

  useEffect(() => {
    messaging().hasPermission().then((status) => {
      setHasNotifPermission(
        status === messaging.AuthorizationStatus.AUTHORIZED ||
          status === messaging.AuthorizationStatus.PROVISIONAL,
      );
    });
  }, []);

  const handleNotificationToggle = (value: boolean) => {
    if (value && !hasNotifPermission) {
      requestAndEnable();
      return;
    }
    updateNotificationSetting(value);
  };

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
        <TouchableOpacity onPress={() => router.back()} className='px-[8px]'>
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

      <View style={styles.view}>
        <Text style={styles.text}>알림 수신</Text>
        <Switch
          value={notificationSetting?.receiveNotifications ?? false}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: '#E0E0E0', true: '#00A775' }}
          thumbColor='#ffffff'
        />
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
        <Text style={styles.text}>{APP_VERSION}</Text>
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
          <Text className='text-center font-semibold text-[18px] text-grayscale-700'>
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
              className='w-[148px] h-[48px] rounded-[5px] border border-green-500 items-center justify-center'
            >
              <Text className='font-medium text-[12px] text-green-500'>
                확인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='w-[148px] h-[48px] rounded-[5px] bg-green-500 items-center justify-center'
              onPress={() => setSignOutModalVisible(false)}
              activeOpacity={0.75}
            >
              <Text className='font-medium text-[12px] text-green-050'>
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
