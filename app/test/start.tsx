/* eslint-disable @typescript-eslint/no-require-imports */
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// side card constants
const CARD_W = 191;
const CARD_H = 277.21;
const CARD_TOP = (SCREEN_HEIGHT * 323) / 852;
// 76025 final state: left card left-edge ≈ -51px off-screen
const CARD_EDGE_OFFSET = -51;
// distance to shift from 76046 spread state → 76025 V-shape state
const SPREAD_OFFSET = 120;

const TestStart = () => {
  const router = useRouter();

  // step 1: side cards fly in (spread → V-shape)
  const spreadAnim = useRef(new Animated.Value(1)).current;
  // step 2: center card slides up from below
  const cardSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(spreadAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const leftTranslateX = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SPREAD_OFFSET],
  });
  const rightTranslateX = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SPREAD_OFFSET],
  });
  const leftRotate = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '-5deg'],
  });
  const rightRotate = spreadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['15deg', '5deg'],
  });

  const cardTranslateY = cardSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나에게 딱 맞는</Text>
      <Text style={styles.title}>강아지를 입양 받아요!</Text>

      {/* step 1 — V-shape side cards */}
      <Animated.View
        style={[
          styles.sideCard,
          {
            left: CARD_EDGE_OFFSET,
            transform: [{ translateX: leftTranslateX }, { rotate: leftRotate }],
          },
        ]}
      >
        <View style={styles.sideCardInner} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sideCard,
          {
            right: CARD_EDGE_OFFSET,
            transform: [{ translateX: rightTranslateX }, { rotate: rightRotate }],
          },
        ]}
      >
        <View style={styles.sideCardInner} />
      </Animated.View>

      {/* step 2 — center card slides up */}
      <Animated.View
        style={[styles.outerBox, { transform: [{ translateY: cardTranslateY }] }]}
      >
        <View style={styles.innerBox}>
          <Image
            source={require('@/assets/images/test/test_start.png')}
            style={{ width: 160, height: 160 }}
          />
        </View>
      </Animated.View>

      <SafeAreaView style={styles.buttonWrapper} edges={['bottom']}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/test/proceeding')}
        >
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default TestStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: (SCREEN_HEIGHT * 112) / 852,
    backgroundColor: '#E4F2E6',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    color: '#282828',
  },
  // V-shape side cards
  sideCard: {
    position: 'absolute',
    top: CARD_TOP,
    width: CARD_W,
    height: CARD_H,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    shadowColor: '#539D5F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 3,
    padding: 7.43,
  },
  sideCardInner: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  // center "앞" card
  outerBox: {
    marginTop: (SCREEN_HEIGHT * 50) / 852,
    marginBottom: (SCREEN_HEIGHT * 120) / 852,
    padding: 9.5,
    width: (SCREEN_WIDTH * 257) / 393,
    height: (SCREEN_HEIGHT * 373) / 852,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#539D5F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 20,
  },
  innerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#0FD380',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F2FFF4',
  },
});
