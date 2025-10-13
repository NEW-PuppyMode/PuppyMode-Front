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
import Apple from '../assets/icons/signin/ic_apple.svg';
import Kakao from '../assets/icons/signin/ic_kakao.svg';
import Background from '../assets/images/signin/background.svg';
import Footprint1 from '../assets/images/signin/footprint1.svg';
import Footprint2 from '../assets/images/signin/footprint2.svg';
import CircleExpoVideo from '../components/page/signin/CircleExpoVideo';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SignIn = () => {
  const { isLoading, error, userInfo, loginWithKakao } = useLogin();

  useEffect(() => {
    if (userInfo?.isNewUser) {
      router.replace('/test/start');
    } else if (userInfo?.isNewUser === false && userInfo?.username) {
      router.replace('/home');
    }
  }, [userInfo]);

  useEffect(() => {
    if (error) {
      Alert.alert('로그인 오류', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>어차피 못지킬 약속,</Text>
        <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
          <Text style={[styles.title, { color: '#3C3C3C', zIndex: 10 }]}>
            <Text style={{ color: '#00A775' }}>강아지 모드</Text>가
            도와드립니다.
          </Text>

          <View style={styles.titleBox} />
        </View>

        <Text style={styles.description}>
          올바른 음주 습관을 가질 수 있도록 도와드릴게요.
        </Text>
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            zIndex: 20,
          }}
        >
          <CircleExpoVideo
            source={require('../assets/videos/signin.mp4')}
            size={SCREEN_WIDTH * 0.5191}
            translateX={0}
            translateY={20}
            scale={1.2}
            style={{ marginTop: SCREEN_HEIGHT * 0.1127 + 20 }}
          />
        </View>
        <View
          style={{
            gap: 13,
            marginTop: 64,
            paddingRight: SCREEN_WIDTH * 0.05,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={[btnStyles.btn, { backgroundColor: '#FEE500' }]}
            activeOpacity={0.8}
            onPress={loginWithKakao}
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
            onPress={() =>
              Alert.alert('준비중', 'Apple 로그인 기능은 준비중입니다.')
            }
          >
            <Apple width={18} height={18} />
            <Text>Apple로 로그인</Text>
            <View />
          </TouchableOpacity>
        </View>
      </View>

      {/* 배경 */}
      <View style={{ position: 'absolute', bottom: 0 }}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Footprint2
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.2395,
              bottom: SCREEN_HEIGHT * 0.5809,
            }}
          />
          <Footprint1
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.1018,
              bottom: SCREEN_HEIGHT * 0.5321,
            }}
          />
          <Background width={SCREEN_WIDTH} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  titleContainer: {
    marginTop: SCREEN_HEIGHT * 0.1655,
    paddingLeft: SCREEN_WIDTH * 0.05,
    width: '100%',
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
    width: 137,
    height: 17,
    backgroundColor: '#E4FAE8',
  },
  description: {
    marginTop: 7,
    color: '#729177',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 24,
  },
  centerCircle: {
    marginTop: SCREEN_HEIGHT * 0.1127,
    width: SCREEN_WIDTH * 0.5191,
    aspectRatio: 1,
    borderRadius: (SCREEN_WIDTH * 0.5191) / 2,
    backgroundColor: '#0FD380',
  },
});

const btnStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
    width: '100%',
    height: 54,
    borderRadius: 6,
  },
});

export default SignIn;
