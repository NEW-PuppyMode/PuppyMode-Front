import { useEnableNotifications } from '@/hooks/notifications/useEnableNotifications';
import { KEYS } from '@/constants/storage';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { axiosInstance } from '@/services/index';
import { describeToken, logAuthEvent } from '@/utils/tokenDebug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useAppleLogin = () => {
  const { requestAndEnable } = useEnableNotifications();
  const queryClient = useQueryClient();

  const handleSignInApple = useCallback(async () => {
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
        credentialState !==
        AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
      ) {
        return null;
      }

      const identityToken = credential.identityToken;
      const authorizationCode = credential.authorizationCode;

      // ✅ API 스펙상 둘 다 필요
      if (!identityToken || !authorizationCode) {
        console.error('Apple 로그인 응답에 token/code가 없습니다.', {
          identityTokenExists: !!identityToken,
          authorizationCodeExists: !!authorizationCode,
        });
        Alert.alert('오류', 'Apple 로그인 정보를 가져오지 못했습니다.');
        return null;
      }

      // ✅ username: 최초 1회만 올 수 있음 (없어도 서버가 허용해야 정상)
      const username =
        credential.fullName?.givenName || credential.fullName?.familyName
          ? `${credential.fullName?.familyName ?? ''}${credential.fullName?.givenName ?? ''}`.trim()
          : undefined;

      try {
        const backendResponse = await axiosInstance.post('/auth/apple/login', {
          authorizationCode,
          identityToken,
          username, // 없으면 undefined로 빠짐
        });

        const { result } = backendResponse.data;
        console.log('[APPLE] isNewUser =', result.userInfo?.isNewUser);
        console.log('[APPLE] userInfo =', result.userInfo);

        // refreshToken이 없으면 아래에서 삭제되어 해당 세션은 재발급이 영영 불가능해진다
        logAuthEvent('login:apple', {
          refreshTokenReceived: !!result.refreshToken,
          access: describeToken(result.accessToken),
          refresh: describeToken(result.refreshToken),
        });

        await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, result.accessToken);
        await AsyncStorage.setItem(KEYS.PROVIDER, 'apple');
        if (result.refreshToken) {
          await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, result.refreshToken);
        } else {
          await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);
        }
        requestAndEnable();

        // 카카오 로그인과 같은 이유로 isNewUser 분기를 두지 않는다.
        // 캐시를 비우고 진입 지점으로 보내면 app/index.tsx가 판정한다.
        queryClient.removeQueries({ queryKey: QUERY_KEYS.me });
        queryClient.removeQueries({ queryKey: QUERY_KEYS.puppyInfo });
        router.replace('/');

        return backendResponse.data;
      } catch (backendError: any) {
        console.error(
          '백엔드 Apple 로그인 실패:',
          backendError.response?.data || backendError.message,
        );

        // 서버가 보내주는 message를 그대로 보여주면 디버깅에 도움됨
        Alert.alert(
          '로그인 실패',
          backendError.response?.data?.message ||
            '서버 통신 중 오류가 발생했습니다.',
        );
        return null;
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') return null;

      console.error('Apple 로그인 에러:', error);
      Alert.alert('로그인 오류', 'Apple 로그인 중 문제가 발생했습니다.');
      return null;
    }
  }, [requestAndEnable, queryClient]);

  return { handleSignInApple };
};
