import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SignIn = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>어차피 못지킬 약속,</Text>
        <Text style={styles.title}>
          <Text style={{ position: 'relative', color: '#00A775' }}>
            강아지 모드
            <Text style={styles.titleBox} />
          </Text>
          가 도와드립니다.
        </Text>

        <Text style={styles.description}>
          올바른 음주 습관을 가질 수 있도록 도와드릴게요.
        </Text>

        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={styles.centerCircle}></View>
        </View>

        <View
          style={{ gap: 13, marginTop: 64, paddingRight: SCREEN_WIDTH * 0.05 }}
        >
          <TouchableOpacity
            style={[btnStyles.btn, { backgroundColor: '#FEE500' }]}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Image
              source={require('@/assets/icons/signin/ic_kakao.svg')}
              style={{ width: 17, height: 16 }}
            />
            <Text>카카오로 로그인</Text>
            <View></View>
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
            onPress={() => {}}
          >
            <Image
              source={require('@/assets/icons/signin/ic_apple.svg')}
              style={{ width: 18, height: 18 }}
            />
            <Text>Apple로 로그인</Text>
            <View></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 배경 */}
      <View style={{ position: 'absolute', bottom: 0, zIndex: -1 }}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Image
            source={require('@/assets/images/signin/footprint2.svg')}
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.23949109414758269720101781170483,
              bottom: SCREEN_HEIGHT * 0.58091549295774647887323943661972,
            }}
          />
          <Image
            source={require('@/assets/images/signin/footprint1.svg')}
            style={{
              position: 'absolute',
              left: SCREEN_WIDTH * 0.10178117048346055979643765903308,
              bottom: SCREEN_HEIGHT * 0.53210093896713615023474178403756,
            }}
          />
          <Image source={require('@/assets/images/signin/background.svg')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginTop: SCREEN_HEIGHT * 0.16549295774647887323943661971831,
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
    bottom: 0,
    right: 0,
    width: '100%',
    height: 17,
    flexShrink: 0,
    backgroundColor: '#E4FAE8',
    zIndex: -1,
  },
  description: {
    marginTop: 7,
    color: '#729177',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 24,
  },
  centerCircle: {
    marginTop: SCREEN_HEIGHT * 0.11267605633802816901408450704225,
    width: SCREEN_WIDTH * 0.5190839694656488549618320610687,
    aspectRatio: 1,
    borderRadius: '100%',
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
