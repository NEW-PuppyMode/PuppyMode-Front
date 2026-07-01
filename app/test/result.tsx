import ResultBG from '@/assets/images/test/result-bg.svg';
import { getPuppyGifSource } from '@/utils/dogMapper';
import {
  getIosNotificationPermissionStatus,
  hasGrantedIosNotificationPermission,
  requestIosNotificationPermission,
} from '@/utils/notificationPermission';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  AppState,
  Dimensions,
  Easing,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TestResult = () => {
  const router = useRouter();
  const shouldRecheckPermissionOnActive = useRef(false);

  const { result } = useLocalSearchParams<{
    result: string;
  }>();

  const { type, puppyBreedKo, puppyBreedEn } = JSON.parse(result);

  const puppyGifSource = getPuppyGifSource(puppyBreedKo, 1, 'normal');

  const cardSlideAnim = useRef(
    new Animated.Value(-SCREEN_HEIGHT * 0.6),
  ).current;

  useEffect(() => {
    Animated.timing(cardSlideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [cardSlideAnim]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' || !shouldRecheckPermissionOnActive.current) {
        return;
      }

      shouldRecheckPermissionOnActive.current = false;

      void (async () => {
        const permission = await getIosNotificationPermissionStatus();
        if (
          permission &&
          hasGrantedIosNotificationPermission(permission)
        ) {
          router.replace('/home');
        }
      })();
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  const handleStart = async () => {
    if (Platform.OS !== 'ios') {
      router.replace('/home');
      return;
    }

    const hasPermission = await requestIosNotificationPermission();

    if (!hasPermission) {
      Alert.alert(
        '알림 권한이 꺼져 있어요',
        'iOS에서는 한 번 거절하면 앱 설정에서 다시 켜야 해요.',
        [
          {
            text: '나중에',
            style: 'cancel',
            onPress: () => router.replace('/home'),
          },
          {
            text: '설정 열기',
            onPress: () => {
              shouldRecheckPermissionOnActive.current = true;
              void Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <ResultBG style={styles.background} />

      <View style={{ marginTop: (SCREEN_HEIGHT * 112) / 852 }}>
        <Text style={styles.title}>
          나는 <Text style={{ color: '#FFF5D7' }}>{type}</Text>
        </Text>
        <Text style={styles.title}>딱 맞는 강아지는..</Text>
      </View>

      <Animated.View
        style={[
          styles.outerBox,
          { transform: [{ translateY: cardSlideAnim }] },
        ]}
      >
        <View style={styles.innerBox}>
          <ExpoImage
            source={puppyGifSource}
            style={{ width: 220, height: 238 }}
            contentFit='cover'
          />
        </View>
      </Animated.View>

      <Text style={styles.korText}>{puppyBreedKo}</Text>
      <Text style={styles.engText}>{puppyBreedEn}</Text>

      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: 16,
          width: '100%',
          justifyContent: 'flex-end',
        }}
        edges={['bottom']}
      >
        <TouchableOpacity style={styles.bottomBtn} onPress={handleStart}>
          <Text className='font-medium text-white'>시작하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default TestResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  background: {
    position: 'absolute',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    color: '#FFF',
    textAlign: 'center',
  },
  outerBox: {
    marginTop: (SCREEN_HEIGHT * 48) / 852,
    marginBottom: (SCREEN_HEIGHT * 21) / 852,
    padding: 9.5,
    width: (SCREEN_WIDTH * 257) / 393,
    height: (SCREEN_HEIGHT * 373) / 852,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  korText: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 40,
    color: '#3C3C3C',
    textAlign: 'center',
  },
  engText: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    color: '#868686',
    textAlign: 'center',
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (SCREEN_HEIGHT * 40) / 852,
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#0FD380',
  },
});
