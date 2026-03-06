import { ReportApi } from '@/services/reportData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
type ReportResultDTO = {
  goal: number;
  drinkRecordCount: number;
  drinkDays: number;
  achievementRate: number;
  scoldedCount: number;
};

const Report = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportResultDTO | null>(null);

  const { year, month } = useLocalSearchParams<{
    year: string;
    month: string;
  }>();
  const now = useMemo(() => new Date(), []);

  const daysInMonth = useMemo(
    () => new Date(Number(year), Number(month), 0).getDate(),
    [year, month],
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await ReportApi.lookupReport(
          Number(year),
          Number(month),
        ); // Authorization 헤더는 axiosInstance 인터셉터로 주입되어야 함
        setData(result);
      } catch (e: any) {
        Alert.alert('알림', e?.message || '리포트 조회에 실패했어요.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text>데이터가 없어요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View className='relative flex-row justify-center w-full py-4 mt-12 '>
        <TouchableOpacity
          className='absolute left-0 self-center '
          onPress={() => router.back()}
        >
          <Image
            className='w-[8px] h-[16px] left-0 self-center ml-4'
            source={require('@/assets/images/chevron_left.png')}
          />
        </TouchableOpacity>
        <View className='self-center '>
          <Text className='text-xl font-semibold'>음주 리포트</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
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
              <Text style={{ color: '#0FD380' }}>{month}월의 나</Text>는
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
              <View
                style={[styles.contentGreenBlock, { flexDirection: 'row' }]}
              >
                <View
                  className='flex-row items-end'
                  style={{ flexDirection: 'row', alignItems: 'flex-end' }}
                >
                  <Text style={styles.contentBlockCommonText}>
                    {data.drinkRecordCount}
                  </Text>
                  <Text
                    className='text-base'
                    style={{
                      color: '#A6DCCC',
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    /{daysInMonth}
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
                  <Text style={styles.contentBlockCommonText}>
                    {data.drinkDays}일
                  </Text>
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
                  <Text style={styles.contentBlockCommonText}>
                    {data.goal}번
                  </Text>
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
                {data.achievementRate}%
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
              marginBottom: 80,
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
              <Text style={styles.contentBlockCommonText}>
                {data.scoldedCount}번
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
