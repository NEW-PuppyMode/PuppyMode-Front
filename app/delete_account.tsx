import NavHeader from '@/components/common/NavHeader';
import { KEYS } from '@/constants/storage';
import { useAuth } from '@/contexts/AuthContext';
import { loginAPI } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DeleteAccount = () => {
  const { logout } = useAuth();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [puppyName, setPuppyName] = useState('멍뭉이');

  // 받침 유무 확인
  const hasFinalConsonant = (word: string) => {
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0) - 44032;

    if (code < 0 || code > 11171) return false;

    return code % 28 !== 0;
  };

  const handleDeleteAccount = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    try {
      const provider = await AsyncStorage.getItem(KEYS.PROVIDER);

      if (provider === 'apple') {
        await loginAPI.withdrawApple();
      } else if (provider === 'kakao') {
        await loginAPI.withdrawKakao();
      } else {
        throw new Error('알 수 없는 로그인 방식입니다.');
      }

      await logout();
      router.replace('/signin');
    } catch (err: any) {
      await logout();
    } finally {
      setIsWithdrawing(false);
    }
  };

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
            {hasFinalConsonant(puppyName)
              ? `${puppyName}이는 이제 볼 수 없을지도 몰라요..`
              : `${puppyName}는 이제 볼 수 없을지도 몰라요..`}
          </Text>
        </View>
        <TouchableOpacity
          className='justify-center items-center w-full h-[60px] rounded-[10px] bg-[#0FD380]'
          onPress={handleDeleteAccount}
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
