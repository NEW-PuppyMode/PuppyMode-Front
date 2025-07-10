import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TestStart = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>나에게 딱 맞는</Text>
      <Text style={styles.title}>강아지를 분양 받아요!</Text>

      <View style={styles.outerBox}>
        <View style={styles.innerBox}>
          <Image
            source={require('@/assets/images/test/test_start.png')}
            style={{ width: 160, height: 160 }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, width: '100%' }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 60,
            borderRadius: 10,
            backgroundColor: '#0FD380',
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24,
              color: '#F2FFF4',
            }}
          >
            시작하기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 배경 */}
      <View
        style={[
          backgroundStyles.box,
          { left: -69, transform: [{ rotate: '-15deg' }] },
        ]}
      />
      <View
        style={[
          backgroundStyles.box,
          { right: -69, transform: [{ rotate: '15deg' }] },
        ]}
      />
    </View>
  );
};

export default TestStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.13145539906103286384976525821596,
    backgroundColor: '#E4F2E6',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    color: '#282828',
  },
  outerBox: {
    marginTop: (SCREEN_HEIGHT * 50) / 852,
    marginBottom: (SCREEN_HEIGHT * 120) / 852,
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
});

const backgroundStyles = StyleSheet.create({
  box: {
    position: 'absolute',
    // sin 15 = 0.2588 = h / 191. h = 49.4
    bottom: (SCREEN_HEIGHT * 211.8) / 852 + 49.4 / 4,
    width: 191,
    height: 277.21,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    boxShadow: '0px 0px 20px 0px rgba(83, 157, 95, 0.20)',
    zIndex: -1,
  },
});
