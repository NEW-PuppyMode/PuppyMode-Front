import ResultBG from '@/assets/images/test/result-bg.svg';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { getPuppyGifSource } from '@/utils/dogMapper';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TestResult = () => {
  const router = useRouter();

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

  const handleStart = () => {
    // 온보딩으로 진입. 필요한 단계와 알림 권한 요청은 온보딩 화면에서 처리한다.
    router.replace('/onboarding');
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
        <PrimaryButton
          title='시작하기'
          onPress={handleStart}
          style={{ marginTop: (SCREEN_HEIGHT * 40) / 852 }}
        />
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
});
