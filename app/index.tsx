import { TextInput } from '@/components/common/Inputs/TextInput';
import { ChoiceButton } from '@/components/page/home/ChoiceButton';
import { IconButton } from '@/components/page/home/IconButton';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PUPPY_MESSAGES } from '@/constants/messages';
import { usePuppyData } from '@/hooks/usePuppyData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const { renamePuppy, renameUser, fetchPuppyInfo, isLoading, setIsLoading } =
    usePuppyData();

  useEffect(() => {
    fetchPuppyInfo().then(() => {
      console.log('finishhh');
    });
  }, []);

  const [showNameInput, setShowNameInput] = useState(false);
  const [inputType, setInputType] = useState<'dog' | 'user' | null>(null);
  const [dogName, setDogName] = useState('');
  const [userName, setUserName] = useState('');

  const [recordMode, setRecordMode] = useState(false);
  const [recordType, setRecordType] = useState<'yesterday' | 'today' | null>(
    null,
  );

  const handleDogNameButtonPress = () => {
    setInputType('dog');
    setShowNameInput(true);
  };

  const handleUserNameButtonPress = () => {
    setInputType('user');
    setShowNameInput(true);
  };

  const handleDrinkRecordPress = () => {
    setRecordMode(!recordMode);
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
  };

  const handleCancel = () => {
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
  };

  const handleRenameComplete = async () => {
    try {
      if (inputType === 'dog' && dogName.trim()) {
        const success = await renamePuppy(dogName);
        if (success) {
          setDogName('');
          setShowNameInput(false);
          setInputType(null);
        }
      } else if (inputType === 'user' && userName.trim()) {
        const success = await renameUser(userName);
        if (success) {
          setUserName('');
          setShowNameInput(false);
          setInputType(null);
        }
      }
    } catch (error) {
      console.log('log');
    }
  };

  // 현재 입력 타입에 따른 값과 설정 함수
  const currentValue = inputType === 'dog' ? dogName : userName;
  const currentSetValue = inputType === 'dog' ? setDogName : setUserName;
  const currentPlaceholder =
    inputType === 'dog' ? '이름을 입력해주세요.' : '이름을 입력해주세요.';

  return (
    <ImageBackground
      source={require('../assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
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
          <TouchableOpacity
            className='p-2 bg-white rounded-full'
            onPress={() => router.push('/calendar')}
          >
            <Ionicons name='calendar-outline' size={24} color='#10B981' />
          </TouchableOpacity>
          <TouchableOpacity
            className='p-2 bg-white rounded-full'
            onPress={() => router.push('/setting')}
          >
            <Ionicons name='settings-outline' size={24} color='#10B981' />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView className='flex-1 px-4 bg-transparent'>
        <SpeechBubble>{PUPPY_MESSAGES.default}</SpeechBubble>

        <ThemedView className='flex-1 justify-center items-center relative bg-transparent'>
          <Image
            source={require('../assets/images/bichon.png')}
            className='w-full h-full aspect-square p-14'
            resizeMode='contain'
          />
        </ThemedView>

        <ThemedView className='rounded-2xl bg-cream-200 '>
          {showNameInput && (
            <ThemedView
              className='mb-6 bg-transparent rounded-xl p-4'
              style={{
                position: 'absolute',
                top: -130,
                left: -15,
                right: -15,
                zIndex: 10,
              }}
            >
              <ThemedView className='flex-row bg-transparent justify-between mb-2'>
                <ChoiceButton label='취소' onPress={handleCancel} />
                <ChoiceButton
                  label='작성 완료'
                  variant={currentValue.trim() ? 'primary' : 'ghost'}
                  onPress={handleRenameComplete}
                />
              </ThemedView>

              <TextInput
                placeholder={currentPlaceholder}
                value={currentValue}
                onChangeText={currentSetValue}
                autoFocus={true}
              />
            </ThemedView>
          )}

          {recordMode && recordType && (
            <ThemedView
              className='bg-transparent rounded-xl p-4'
              style={{
                position: 'absolute',
                top: -115,
                left: -15,
                right: -15,
                zIndex: 10,
              }}
            >
              <ThemedView
                className='flex-row bg-transparent mb-2'
                style={{
                  justifyContent:
                    recordType === 'yesterday' ? 'flex-start' : 'flex-end',
                }}
              >
                <SpeechBubble variant='user'>술 마셨어!</SpeechBubble>
                <ThemedView className='w-[10px] bg-transparent' />
                <SpeechBubble variant='user'>술 안 마셨어!</SpeechBubble>
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView className='flex-col mb-10 rounded-xl p-6'>
            <ThemedView className='flex-row justify-between mb-4'>
              {!recordMode ? (
                <>
                  <IconButton
                    iconName='paw'
                    text='강아지 이름 지어주기'
                    variant={inputType === 'dog' ? 'primary' : 'ghost'}
                    onPress={handleDogNameButtonPress}
                  />

                  <IconButton
                    iconName='person'
                    text='내 이름 알려주기'
                    variant={inputType === 'user' ? 'primary' : 'ghost'}
                    onPress={handleUserNameButtonPress}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    iconName='calendar'
                    text='어제 까먹은 거 기록할래!'
                    variant={
                      recordType === 'yesterday' ? 'primary' : 'lightgreen'
                    }
                    onPress={() => {
                      setRecordType('yesterday');
                    }}
                  />

                  <IconButton
                    iconName='today'
                    text='오늘 기록할래!'
                    variant={recordType === 'today' ? 'primary' : 'lightgreen'}
                    onPress={() => {
                      setRecordType('today');
                    }}
                  />
                </>
              )}
            </ThemedView>

            <ThemedView className='flex-row justify-between'>
              <IconButton
                iconName='chatbubble'
                text='나만의 한마디만 해줘'
                onPress={() => console.log('클릭')}
              />

              <IconButton
                iconName='checkbox'
                text='음주 기록 할래!'
                variant={recordMode ? 'primary' : 'ghost'}
                onPress={handleDrinkRecordPress}
              />
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
