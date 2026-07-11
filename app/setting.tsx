import DefaultModal from '@/components/common/DefaultModal';
import ChevronLeftImage from '@/assets/images/chevron_left.png';
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
import {
  getIosNotificationPermissionStatus,
  hasGrantedIosNotificationPermission,
  requestIosNotificationPermission,
} from '@/utils/notificationPermission';
import messaging from '@react-native-firebase/messaging';
import { useQueryClient } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  AppState,
  Image,
  Linking,
  Platform,
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

  const checkPermission = useCallback(async () => {
    const status = await messaging().hasPermission();
    setHasNotifPermission(
      status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL,
    );
  }, []);

  // 화면 진입 시, 그리고 OS 설정에서 권한을 바꾸고 앱으로 복귀했을 때
  // OS 권한 상태를 다시 읽어 안내 배너를 최신으로 유지한다.
  useFocusEffect(
    useCallback(() => {
      checkPermission();
      const subscription = AppState.addEventListener('change', (nextState) => {
        if (nextState === 'active') {
          checkPermission();
        }
      });
      return () => subscription.remove();
    }, [checkPermission]),
  );

  // OS 권한은 거부됐는데 서버 설정은 켜져 있는 상태(조용한 실패, 토글은 ON).
  const showPermissionNotice =
    !hasNotifPermission && !!notificationSetting?.receiveNotifications;

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

  const handleNotificationSettingPress = async () => {
    if (Platform.OS !== 'ios') {
      void Linking.openSettings();
      return;
    }

    const currentPermission = await getIosNotificationPermissionStatus();
    const hasPermission = await requestIosNotificationPermission();

    if (hasPermission) {
      if (
        currentPermission &&
        !hasGrantedIosNotificationPermission(currentPermission)
      ) {
        return;
      }

      void Linking.openSettings();
      return;
    }

    Alert.alert(
      '알림 권한이 꺼져 있어요',
      'iOS에서는 앱 설정에서 알림 권한을 다시 변경할 수 있어요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ],
    );
  };

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
            source={ChevronLeftImage}
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

      {showPermissionNotice && (
        <TouchableOpacity
          style={styles.permissionNotice}
          activeOpacity={0.7}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.permissionNoticeText}>
            기기 알림이 꺼져 있어 알림을 받을 수 없어요.
          </Text>
          <Text style={styles.permissionNoticeAction}>설정 열기</Text>
        </TouchableOpacity>
      )}

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
        title='알림 설정'
        onPress={handleNotificationSettingPress}
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
  permissionNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF4F4',
  },
  permissionNoticeText: {
    flex: 1,
    color: '#D14343',
    fontSize: 13,
    lineHeight: 18,
  },
  permissionNoticeAction: {
    marginLeft: 12,
    color: '#D14343',
    fontSize: 13,
    fontWeight: '600',
  },
});
