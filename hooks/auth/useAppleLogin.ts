import { KEYS } from '@/constants/storage';
import { axiosInstance } from '@/services/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { Alert } from 'react-native';

async function handleSignInApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const credentialState = await AppleAuthentication.getCredentialStateAsync(
      credential.user,
    );

    if (
      credentialState ===
      AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
    ) {
      const identityToken = credential.identityToken;

      if (!identityToken) {
        console.error('Apple 로그인 응답에 identityToken이 없습니다.');
        Alert.alert('오류', 'Apple 로그인 정보를 가져오지 못했습니다.');
        return null;
      }

      try {
        const backendResponse = await axiosInstance.post('/auth/apple/login', {
          identityToken: identityToken,
        });

        await AsyncStorage.setItem(
          KEYS.ACCESS_TOKEN,
          backendResponse.data.access,
        );
        router.replace('/home');

        return backendResponse.data;
      } catch (backendError: any) {
        console.error(
          '백엔드 Apple 로그인 실패:',
          backendError.response?.data || backendError.message,
        );
        Alert.alert('로그인 실패', '서버 통신 중 오류가 발생했습니다.');
        return null;
      }
    }
    return null;
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      // 사용자가 취소한 경우 (로그 생략 가능)
      // console.log('사용자가 Apple 로그인을 취소했습니다.');
    } else {
      // 기타 에러 처리
      console.error('Apple 로그인 에러:', error);
      Alert.alert('로그인 오류', 'Apple 로그인 중 문제가 발생했습니다.');
    }
    return null;
  }
}

export const useAppleLogin = () => {
  return { handleSignInApple };
};
