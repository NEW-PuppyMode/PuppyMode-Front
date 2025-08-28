import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const Report = () => {
  const router = useRouter();
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

// import { StatCard } from '@/components/page/report/StatCard';
// import { Stack, useRouter } from 'expo-router';
// import React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // Get screen dimensions for responsive modal sizing
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
// });

// export default function Report() {
//   const router = useRouter();
//   return (
//     <>
//       <Stack.Screen options={{ headerShown: false }} />
//       <View style={styles.container}>
//         {/* 상단 헤더 */}
//         <View className='py-4 mt-12'>
//           <TouchableOpacity
//             className='relative flex-row justify-center'
//             onPress={() => router.push('/')}
//           >
//             <Image
//               className='w-[8px] h-[16px] absolute left-0 self-center ml-4'
//               source={require('@/assets/images/chevron_left.png')}
//             />
//             <View className='self-center'>
//               <Text className='text-xl font-semibold'>음주 리포트</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View className='mx-4 mt-[22px]'>
//           {/* ~의 나는 */}
//           <View className='flex-col items-center '>
//             <Text className='text-2xl font-bold'>
//               <Text className='text-green-500 '>1월의 나</Text>는
//             </Text>
//             <Text className='text-2xl font-bold'>이렇게 살았다</Text>
//           </View>

//           <View className='flex-col gap-4 mt-[31px]'>
//             <View className='flex-row h-[256px] '>
//               <View className='flex-1 mr-4'>
//                 <StatCard title='음주 기록 횟수' value='15' subValue='/31' />
//               </View>

//               <View className='flex-col flex-1 '>
//                 <StatCard title='술 마신 날' value='10일' />
//                 <StatCard title='이번 달 목표!' value='15번' />
//               </View>
//             </View>

//             <View className='h-[120px]'>
//               <StatCard
//                 title='이번달'
//                 secondTitle='목표 달성'
//                 thirdTitle='확률'
//                 value='28%'
//                 bigSquare={true}
//                 rowSquare={true}
//               />
//             </View>

//             <View className='h-[120px]'>
//               <StatCard
//                 title='이번달'
//                 secondTitle='한마디'
//                 thirdTitle='들은 횟수'
//                 value='3번'
//                 rowSquare={true}
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     </>
//   );
// }
