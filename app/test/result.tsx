import ResultBG from '@/assets/images/test/result-bg.svg';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TestResult = () => {
  const router = useRouter();

  const { result } = useLocalSearchParams<{
    result: string;
  }>();

  const { type, puppyBreedKo, puppyBreedEn, description, imageUrl } =
    JSON.parse(result);
  return (
    <View style={styles.container}>
      <ResultBG style={styles.background} />

      <View style={{ marginTop: (SCREEN_HEIGHT * 112) / 852 }}>
        <Text style={styles.title}>
          나는 <Text style={{ color: '#FFF5D7' }}>{type}</Text>
        </Text>
        <Text style={styles.title}>딱 맞는 강아지는..</Text>
      </View>

      <View style={styles.outerBox}>
        <View style={styles.innerBox}>
          <ExpoImage
            source={{ uri: imageUrl }}
            style={{ width: 148, height: 160 }}
            contentFit='cover'
            cachePolicy='disk'
            onError={(e) => {
              console.log('Image load error:', e);
              console.log('imageUrl:', imageUrl);
            }}
          />
        </View>
      </View>

      <Text style={styles.korText}>{puppyBreedKo}</Text>
      <Text style={styles.engText}>{puppyBreedEn}</Text>

      <View style={{ paddingHorizontal: 16, width: '100%' }}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => router.push('/home')}
        >
          <Text className='font-medium text-white'>시작하기</Text>
        </TouchableOpacity>
      </View>
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
    width: SCREEN_WIDTH * 0.65394402035623409669211195928753,
    height: SCREEN_HEIGHT * 0.43779342723004694835680751173709,
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
    color: '#F2FFF4',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontStyle: 'normal',
  },
});
