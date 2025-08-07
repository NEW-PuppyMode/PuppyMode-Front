import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
      {/* 상단 상태바 영역 */}
      <ThemedView className='flex-row justify-between items-center gap-12 px-4 pt-20 bg-transparent'>
        <ThemedView className='flex-1 p-4 rounded-2xl'>
          <ThemedView className='flex-row items-center mb-2'>
            <ThemedView className='bg-green-500 px-2 py-1 rounded-full'>
              <ThemedText className='text-white text-xs font-semibold'>
                Level 1
              </ThemedText>
            </ThemedView>
            <ThemedText className='ml-2 text-sm text-gray-600'>
              눈송이 비숑
            </ThemedText>
            <ThemedText className='ml-auto text-green-600 font-bold'>
              55%
            </ThemedText>
          </ThemedView>
          <ThemedView className='bg-gray-200 h-2 rounded-full'>
            <ThemedView className='bg-green-500 h-2 rounded-full w-[55%]' />
          </ThemedView>
        </ThemedView>

        <ThemedView className='flex-row ml-4 gap-1 bg-transparent'>
          <TouchableOpacity className='p-2 bg-white rounded-full'>
            <Ionicons name='calendar-outline' size={24} color='#10B981' />
          </TouchableOpacity>
          <TouchableOpacity className='p-2 bg-white rounded-full'>
            <Ionicons name='settings-outline' size={24} color='#10B981' />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* 메인 콘텐츠 영역 */}
      <ThemedView className='flex-1 px-4 bg-transparent'>
        {/* 인사말 */}
        <ThemedView className='mt-8 mb-4 bg-cream-300 rounded-xl'>
          <ThemedText className='color-gray-950 text-base leading-6 text-center p-4'>
            주인님!{'\n'}
            제가 금주는 도와드려도{'\n'}
            해야할 일을 도와드릴 순 없어요..
          </ThemedText>
        </ThemedView>

        {/* 캐릭터 및 배경 이미지 */}
        <ThemedView className='flex-1 justify-center items-center relative bg-transparent'>
          <Image
            source={require('../assets/images/bichon.png')}
            className='w-full h-full aspect-square p-14'
            resizeMode='contain'
          />
        </ThemedView>

        {/* 하단 버튼들 */}
        <ThemedView className='rounded-2xl bg-cream-300 '>
          <ThemedView className='flex-col mb-10 rounded-xl p-6'>
            <ThemedView className='flex-row justify-between mb-4'>
              <TouchableOpacity className='flex-row gap-2 bg-white p-2 rounded-2xl shadow-sm flex-1 mr-2 items-center'>
                <Ionicons name='paw' size={24} color='#10B981' />
                <ThemedText className='flex-1 text-sm text-gray-700 text-center flex-shrink-0'>
                  강아지 이름 지어주기
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity className='flex-row gap-2 bg-white p-2 rounded-2xl shadow-sm flex-1 ml-2 items-center'>
                <Ionicons name='person' size={24} color='#10B981' />
                <ThemedText className='flex-1 text-sm text-gray-700 text-center flex-shrink-0'>
                  내 이름 알려주기
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView className='flex-row justify-between'>
              <TouchableOpacity className='flex-row gap-2 bg-white p-2 rounded-2xl shadow-sm flex-1 mr-2 items-center'>
                <Ionicons name='chatbubble' size={24} color='#10B981' />
                <ThemedText className='flex-1 text-sm text-gray-700 text-center flex-shrink-0'>
                  나만의 한마디만 해줘
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity className='flex-row gap-2 bg-white p-2 rounded-2xl shadow-sm flex-1 ml-2 items-center'>
                <Ionicons name='checkbox' size={24} color='#10B981' />
                <ThemedText className='flex-1 text-sm text-gray-700 text-center flex-shrink-0'>
                  음주 기록 할래!
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
