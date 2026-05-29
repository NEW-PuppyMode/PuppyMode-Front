import { useAppleLogin } from '@/hooks/auth/useAppleLogin';
import { useLogin } from '@/hooks/auth/useLogin';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { PUPPY_QUERY_KEYS } from '@/hooks/queries/usePuppyInfoQuery';
import { logButtonTap } from '@/utils/analytics';
import { useQueryClient } from '@tanstack/react-query';
import Apple from '../assets/icons/signin/ic_apple.svg';
import Kakao from '../assets/icons/signin/ic_kakao.svg';
import Background from '../assets/images/signin/background.svg';
import Footprint1 from '../assets/images/signin/footprint1.svg';
import Footprint2 from '../assets/images/signin/footprint2.svg';
import CircleExpoVideo from '../components/page/signin/CircleExpoVideo';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL = SCREEN_HEIGHT <= 700; // iPhone 7(667)

const SignIn = () => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { isLoading, error, userInfo, loginWithKakao } = useLogin();
  const { handleSignInApple } = useAppleLogin();

  useEffect(() => {
    if (userInfo?.isNewUser) router.replace('/test/start');
    else if (userInfo?.isNewUser === false && userInfo?.username) {
      queryClient.removeQueries({
        queryKey: PUPPY_QUERY_KEYS.puppyInfo,
      });
      router.replace('/home');
    }
  }, [userInfo]);

  useEffect(() => {
    if (error) Alert.alert('로그인 오류', error);
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ===== 상단 타이틀/설명 ===== */}
        <View style={styles.topBlock}>
          <Text style={styles.title}>어차피 못지킬 약속,</Text>

          <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
            <Text style={[styles.title, { color: '#3C3C3C', zIndex: 10 }]}>
              <Text style={{ color: '#00A775' }}>멍뭉이</Text>가 도와드립니다.
            </Text>
            <View style={styles.titleBox} />
          </View>

          <Text style={[styles.title, { color: '#00A775' }]}>
            멍멍멍머엄어어머엄머엉
          </Text>

          <Text style={styles.description}>
            올바른 음주 습관을 가질 수 있도록 도와드릴게요.
          </Text>
        </View>

        {/* ===== 강아지 Gif 영상 ===== */}
        <View style={styles.middleBlock}>
          <CircleExpoVideo
            source={require('../assets/videos/signin.mp4')}
            size={192}
            translateX={0}
            translateY={0}
            scale={1.2}
          />
        </View>

        {/* ===== 하단 로그인 버튼 ===== */}
        <View style={styles.bottomBlock}>
          <TouchableOpacity
            style={[btnStyles.btn, { backgroundColor: '#FEE500' }]}
            activeOpacity={0.8}
            onPress={() => {
              logButtonTap('login_kakao');
              loginWithKakao();
            }}
            disabled={isLoading}
          >
            <Kakao width={17} height={16} />
            {isLoading ? (
              <ActivityIndicator color='#3C1E1E' />
            ) : (
              <Text>카카오로 로그인</Text>
            )}
            <View />
          </TouchableOpacity>

          {/* ===== Android는 빌드할 때 애플 로그인 주석 처리하기 ===== */}
          <TouchableOpacity
            style={[
              btnStyles.btn,
              {
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#C1C1C1',
              },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              logButtonTap('login_apple');
              handleSignInApple();
            }}
            disabled={isLoading}
          >
            <Apple width={18} height={18} />
            <Text>Apple로 로그인</Text>
            <View />
          </TouchableOpacity>
          {/* ===== 주석 처리하기 ===== */}
        </View>
      </View>

      {/* ===== 배경 ===== */}
      <View pointerEvents='none' style={styles.bg}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Footprint2
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.2395,
              bottom: SCREEN_HEIGHT * 0.65,
            }}
          />
          <Footprint1
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.1018,
              bottom: SCREEN_HEIGHT * 0.6,
            }}
          />
          <Background width={SCREEN_WIDTH} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 16,
    zIndex: 10,
  },

  topBlock: {
    flexShrink: 1, // 작은 기기에서 텍스트가 필요한 만큼만 차지하게
  },

  middleBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
  },

  bottomBlock: {
    gap: 13,
    paddingTop: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    color: '#3C3C3C',
    textAlign: 'left',
  },

  titleBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    width: 63,
    backgroundColor: '#E4FAE8',
  },

  description: {
    marginTop: 7,
    color: '#729177',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 24,
  },

  bg: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});

const btnStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 27,
    width: '100%',
    height: 54,
    borderRadius: 6,
  },
});

export default SignIn;
