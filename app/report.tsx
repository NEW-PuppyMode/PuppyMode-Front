import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Report = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 48,
          width: '100%',
          height: 60,
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={require('@/assets/icons/report/ic_back.svg')}
            style={{ margin: 10 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>음주 리포트</Text>
        <View style={{ width: 24 }}></View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 22,
          marginBottom: 31,
          width: '100%',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.summaryTitle}>
            <Text style={{ color: '#0FD380' }}>1월의 나</Text>는
          </Text>
          <Text style={styles.summaryTitle}>이렇게 살았다</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
        <View
          style={[
            styles.contentBox,
            {
              flex: 1,
              paddingTop: 21,
              paddingLeft: 11,
              paddingRight: 16,
              paddingBottom: 20,
              height: 256,
            },
          ]}
        >
          <Text style={styles.contentText}>음주 기록 횟수</Text>
          <View style={{ alignItems: 'flex-end', width: '100%' }}>
            <View style={[styles.contentGreenBlock, { flexDirection: 'row' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={styles.contentBlockCommonText}>15</Text>
                <Text
                  style={{
                    color: '#A6DCCC',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  /31
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, gap: 16 }}>
          <View
            style={[
              styles.contentBox,
              {
                flex: 1,
                paddingTop: 21,
                paddingLeft: 14,
                paddingRight: 16,
                paddingBottom: 20,
              },
            ]}
          >
            <Text style={styles.contentText}>술 마신 날</Text>
            <View style={{ alignItems: 'flex-end', width: '100%' }}>
              <View
                style={[styles.contentGreenBlock, { flexDirection: 'row' }]}
              >
                <Text style={styles.contentBlockCommonText}>10일</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.contentBox,
              {
                flex: 1,
                paddingTop: 21,
                paddingLeft: 14,
                paddingRight: 16,
                paddingBottom: 20,
              },
            ]}
          >
            <Text style={styles.contentText}>이번 달 목표!</Text>
            <View style={{ alignItems: 'flex-end', width: '100%' }}>
              <View
                style={[styles.contentGreenBlock, { flexDirection: 'row' }]}
              >
                <Text style={styles.contentBlockCommonText}>15번</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.contentBox,
          {
            flexDirection: 'row',
            marginTop: 16,
            width: '100%',
            height: 120,
            paddingTop: 21,
            paddingLeft: 13,
            paddingRight: 16,
            paddingBottom: 16,
          },
        ]}
      >
        <Text style={styles.contentText}>
          이번 달 {'\n'}목표 달성 {'\n'}확률
        </Text>
        <View style={{ justifyContent: 'flex-end' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 108,
              height: 54,
              borderRadius: 15,
              backgroundColor: '#0FD380',
            }}
          >
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontSize: 30,
                fontWeight: '800',
                lineHeight: 40,
              }}
            >
              28%
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.contentBox,
          {
            flexDirection: 'row',
            marginTop: 16,
            width: '100%',
            height: 120,
            paddingTop: 21,
            paddingLeft: 13,
            paddingRight: 16,
            paddingBottom: 16,
          },
        ]}
      >
        <Text style={styles.contentText}>
          이번 달 {'\n'}한마디 {'\n'}들은 횟수
        </Text>
        <View style={{ justifyContent: 'flex-end' }}>
          <View style={styles.contentGreenBlock}>
            <Text style={styles.contentBlockCommonText}>3번</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  title: {
    color: '#282828',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  summaryTitle: {
    color: '#282828',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 40,
    textAlign: 'center',
  },
  contentBox: {
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#EAEAEA',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  contentText: {
    color: '#3C3C3C',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  contentGreenBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 86,
    height: 44,
    flexShrink: 0,
    borderRadius: 15,
    backgroundColor: '#E4FAE8',
  },
  contentBlockCommonText: {
    color: '#0FD380',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
});
