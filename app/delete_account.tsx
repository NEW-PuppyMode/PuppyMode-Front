import NavHeader from '@/components/common/NavHeader';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DeleteAccount = () => {
  const { logout } = useAuth();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <NavHeader title='탈퇴하기' />
      <View className='flex-1 justify-between p-[16px]'>
        <View
          className='px-[4px] flex-1'
          style={{
            gap: (SCREEN_HEIGHT * 12) / 852,
            paddingTop: (SCREEN_HEIGHT * 62) / 852,
          }}
        >
          <Text className='text-[#3C3C3C] text-[30px] font-bold'>
            정말 떠나시나요?
          </Text>
          <Text className='text-[#C1C1C1] text-[18px] font-medium'>
            OOO이는 이제 볼 수 없을지도 몰라요..
          </Text>
        </View>
        <TouchableOpacity
          className='justify-center items-center w-full h-[60px] rounded-[10px] bg-[#0FD380]'
          onPress={() => {
            logout();
            router.replace('/signin');
          }}
        >
          <Text className='text-center text-[16px] font-medium leading-[24px] text-[#F2FFF4]'>
            계정 삭제
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeleteAccount;
