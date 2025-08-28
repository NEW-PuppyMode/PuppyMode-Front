import { StatCard } from '@/components/page/report/StatCard';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Get screen dimensions for responsive modal sizing
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default function Report() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View className='py-4 mt-12'>
          <TouchableOpacity
            className='relative flex-row justify-center'
            onPress={() => router.push('/')}
          >
            <Image
              className='w-[8px] h-[16px] absolute left-0 self-center ml-4'
              source={require('@/assets/images/chevron_left.png')}
            />
            <View className='self-center'>
              <Text className='text-xl font-semibold'>음주 리포트</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='mx-4 mt-[22px]'>
          {/* ~의 나는 */}
          <View className='flex-col items-center '>
            <Text className='text-2xl font-bold'>
              <Text className='text-green-500 '>1월의 나</Text>는
            </Text>
            <Text className='text-2xl font-bold'>이렇게 살았다</Text>
          </View>

          <View className='flex-col gap-4 mt-[31px]'>
            <View className='flex-row h-[256px] '>
              <View className='flex-1 mr-4'>
                <StatCard title='음주 기록 횟수' value='15' subValue='/31' />
              </View>

              <View className='flex-col flex-1 '>
                <StatCard title='술 마신 날' value='10일' />
                <StatCard title='이번 달 목표!' value='15번' />
              </View>
            </View>

            <View className='h-[120px]'>
              <StatCard
                title='이번달'
                secondTitle='목표 달성'
                thirdTitle='확률'
                value='28%'
                bigSquare={true}
                rowSquare={true}
              />
            </View>

            <View className='h-[120px]'>
              <StatCard
                title='이번달'
                secondTitle='한마디'
                thirdTitle='들은 횟수'
                value='3번'
                rowSquare={true}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
