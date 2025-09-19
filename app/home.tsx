/* eslint-disable @typescript-eslint/no-require-imports */
import { TextInput } from '@/components/common/Inputs/TextInput';
import { ChoiceButton } from '@/components/page/home/ChoiceButton';
import { ControlButton } from '@/components/page/home/ControlButton';
import { IconButton } from '@/components/page/home/IconButton';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PUPPY_MESSAGES } from '@/constants/messages';
import { usePuppyData } from '@/hooks/usePuppyData';
import { IsRecorded, RecentGoal } from '@/types/models/puppy';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const {
    renamePuppy,
    renameUser,
    fetchPuppyInfo,
    puppyInfo,
    advicePuppy,
    fetchIsRecorded,
    fetchRecentGoal,
    fetchGoal30daysPassed,
    createDrinkHistory,
    createGoal,
  } = usePuppyData();

  useEffect(() => {
    const fetchData = async () => {
      fetchPuppyInfo();
      const recentGoal = await fetchRecentGoal();
      const goal30daysPassed = await fetchGoal30daysPassed();
      const isRecorded = await fetchIsRecorded();

      setRecentGoal(recentGoal);
      setGoal30daysPassed(goal30daysPassed);
      setIsRecorded(isRecorded);
    };

    fetchData();
  }, []);

  const [isRecorded, setIsRecorded] = useState<IsRecorded | false>(false);
  const [recentGoal, setRecentGoal] = useState<RecentGoal | false>(false);
  const [goal30daysPassed, setGoal30daysPassed] = useState<boolean | false>(
    false,
  );

  const [messageKey, setMessageKey] = useState<
    | 'default'
    | 'archiveToday'
    | 'archiveYesterday'
    | 'makeGoal'
    | 'makeNewGoal'
    | 'namingUser'
    | 'namingPuppy'
    | 'archiveSuccess'
  >('default');
  const [adviceMessage, setAdviceMessage] = useState<string>('');
  const [renameMessage, setRenameMessage] = useState<React.ReactNode>(null);

  const [showNameInput, setShowNameInput] = useState(false);
  const [inputType, setInputType] = useState<'dog' | 'user' | null>(null);
  const [dogName, setDogName] = useState('');
  const [userName, setUserName] = useState('');

  const [recordMode, setRecordMode] = useState(false);
  const [recordType, setRecordType] = useState<'yesterday' | 'today' | null>(
    null,
  );
  const [showGoalOptions, setShowGoalOptions] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalType, setGoalType] = useState<'same' | 'new' | null>(null);
  const [goalCount, setGoalCount] = useState(10);

  const handleNewGoalClick = () => {
    setShowGoalInput(true);
    setGoalType('new');
    setMessageKey('makeNewGoal');
  };

  const handleDogNameButtonPress = () => {
    setInputType('dog');
    setShowNameInput(true);
    setMessageKey('namingPuppy');
  };

  const handleUserNameButtonPress = () => {
    setInputType('user');
    setShowNameInput(true);
    setMessageKey('namingUser');
  };

  const handleDrinkRecordPress = () => {
    setRecordMode(!recordMode);
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
    setMessageKey('default');
    setAdviceMessage('');
  };

  const handleCancel = () => {
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
    setMessageKey('default');
  };

  const handleShowGoalOptions = () => {
    setAdviceMessage('');
    setRenameMessage('');
    setShowGoalOptions((prev) => {
      const newState = !prev;
      setMessageKey(newState ? 'makeGoal' : 'default');
      setGoalType(null);
      setShowGoalInput(false);
      return newState;
    });
  };

  const handleRenameComplete = async () => {
    try {
      if (inputType === 'dog' && dogName.trim()) {
        const success = await renamePuppy(dogName);

        if (success) {
          setDogName('');
          setShowNameInput(false);
          setInputType(null);
          const coloredMessage = (
            <>
              <Text>허걱{'\n'}</Text>
              <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>
                {dogName}
              </Text>
              이라니..
              <Text>{'\n'}나쁘지 않지만.. 좋진 않아요..</Text>
            </>
          );
          setRenameMessage(coloredMessage);
        }
      } else if (inputType === 'user' && userName.trim()) {
        const success = await renameUser(userName);
        if (success) {
          setUserName('');
          setShowNameInput(false);
          setInputType(null);
          const coloredMessage = (
            <>
              <Text>와우 {'\n'}</Text>
              <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>
                {userName}
              </Text>
              ?<Text>{'\n'}감다살이네요.</Text>
            </>
          );
          setRenameMessage(coloredMessage);
        }
      }
    } catch (error) {
      console.log('error');
    } finally {
      fetchPuppyInfo();
    }
  };

  const handleAdviceClick = async () => {
    const result = await advicePuppy();
    setAdviceMessage(result || '');
    setRenameMessage('');
    setShowGoalOptions(false);
    setMessageKey('default');
    setRecordMode(false);
  };

  const level = puppyInfo?.puppyLevel ?? 0;
  const percent = puppyInfo?.puppyLevelPercent ?? 0;
  const displayName = puppyInfo?.isPuppyName
    ? puppyInfo.puppyLevelName
    : '눈송이 비숑';

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
                Level {level}
              </ThemedText>
            </ThemedView>
            <ThemedText className='ml-2 text-sm text-gray-600'>
              {displayName}
            </ThemedText>
            <ThemedText className='ml-auto text-green-600 font-bold'>
              {percent}%
            </ThemedText>
          </ThemedView>
          <ThemedView className='bg-gray-200 h-2 rounded-full'>
            <ThemedView
              className='bg-green-500 h-2 rounded-full'
              style={{ width: `${percent}%` }}
            />
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
        <SpeechBubble>
          {renameMessage || adviceMessage || PUPPY_MESSAGES[messageKey]}
        </SpeechBubble>

        <ThemedView className='flex-1 justify-center items-center relative bg-transparent'>
          <Image
            source={
              adviceMessage !== ''
                ? require('../assets/images/bichon_angry.png')
                : require('../assets/images/bichon.png')
            }
            style={{ width: 300, height: 300, padding: 14 }}
            resizeMode='contain'
          />
        </ThemedView>

        <ThemedView className='rounded-2xl bg-transparent shadow-lg'>
          {/* 이름 설정 */}
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

          {/* 음주 기록 */}
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
                <SpeechBubble
                  variant='user'
                  onPress={() => {
                    setMessageKey('archiveSuccess');
                    setRecordMode(false);
                    setRecordType(null);

                    const drinkDate = new Date();
                    if (recordType === 'yesterday') {
                      drinkDate.setDate(drinkDate.getDate() - 1);
                    } else if (recordType === 'today') {
                      drinkDate.setDate(drinkDate.getDate());
                    }
                    const formattedDate = drinkDate.toISOString().slice(0, 10);
                    createDrinkHistory({
                      drinkDate: formattedDate,
                      isDrink: true,
                    });

                    fetchPuppyInfo();
                  }}
                >
                  술 마셨어!
                </SpeechBubble>
                <ThemedView className='w-[10px] bg-transparent' />
                <SpeechBubble
                  variant='user'
                  onPress={() => {
                    setMessageKey('archiveSuccess');
                    setRecordMode(false);
                    setRecordType(null);

                    const drinkDate = new Date();
                    if (recordType === 'yesterday') {
                      drinkDate.setDate(drinkDate.getDate() - 1);
                    } else if (recordType === 'today') {
                      drinkDate.setDate(drinkDate.getDate());
                    }
                    const formattedDate = drinkDate.toISOString().slice(0, 10);
                    createDrinkHistory({
                      drinkDate: formattedDate,
                      isDrink: false,
                    });

                    fetchPuppyInfo();
                  }}
                >
                  술 안 마셨어!
                </SpeechBubble>
              </ThemedView>
            </ThemedView>
          )}

          {/* 목표 설정 */}
          {showGoalOptions && showGoalInput && (
            <ThemedView
              className='mb-6 bg-transparent rounded-xl p-4'
              style={{
                position: 'absolute',
                top: -80,
                left: -15,
                right: -15,
                zIndex: 10,
              }}
            >
              <ThemedView className='flex-row bg-transparent justify-between items-center mb-2'>
                <ChoiceButton
                  label='취소'
                  onPress={() => {
                    setShowGoalInput(false);
                    setShowGoalOptions(false);
                    setGoalCount(10);
                  }}
                />

                <ThemedView className='flex-row items-center justify-between bg-transparent'>
                  <ControlButton
                    label='-'
                    onPress={() => setGoalCount((n) => Math.max(1, n - 1))}
                  />

                  <ThemedView className='bg-green-100 rounded-2xl px-6 py-3 mx-1 shadow-lg'>
                    <ThemedText
                      style={{
                        color: '#21D08A',
                        fontWeight: '600',
                        fontSize: 20,
                      }}
                    >
                      {goalCount}번
                    </ThemedText>
                  </ThemedView>

                  <ControlButton
                    label='+'
                    onPress={() => setGoalCount((n) => n + 1)}
                  />
                </ThemedView>

                <ChoiceButton
                  label='작성 완료'
                  variant='primary'
                  onPress={() => {
                    createGoal({
                      goal: goalCount,
                      isNew: true,
                    });
                    setShowGoalInput(false);
                    setShowGoalOptions(false);
                    setGoalCount(0);

                    fetchPuppyInfo();
                  }}
                />
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView className='flex-col mb-10 rounded-xl p-6 bg-cream-200'>
            <ThemedView className='flex-row justify-between mb-4 bg-transparent'>
              {showGoalOptions ? (
                <>
                  <IconButton
                    iconName='document-text-outline'
                    text='지난 달이랑 똑같아!'
                    variant={goalType === 'same' ? 'primary' : 'lightgreen'}
                    onPress={() => {
                      setGoalType('same');
                      setShowGoalInput(false);
                      setShowGoalOptions(false);
                      createGoal({
                        goal: 0,
                        isNew: false,
                      });

                      fetchPuppyInfo();
                    }}
                  />
                  <IconButton
                    iconName='document-text-outline'
                    text='새로운 목표로 가자!'
                    variant={goalType === 'new' ? 'primary' : 'lightgreen'}
                    onPress={handleNewGoalClick}
                  />
                </>
              ) : !recordMode &&
                !(puppyInfo?.isPuppyName && puppyInfo?.isMyName) ? (
                <>
                  <IconButton
                    iconName='paw'
                    text='강아지 이름 지어주기'
                    variant={inputType === 'dog' ? 'primary' : 'ghost'}
                    onPress={handleDogNameButtonPress}
                    disabled={puppyInfo?.isPuppyName === true}
                  />
                  <IconButton
                    iconName='person'
                    text='내 이름 알려주기'
                    variant={inputType === 'user' ? 'primary' : 'ghost'}
                    onPress={handleUserNameButtonPress}
                    disabled={puppyInfo?.isMyName === true}
                  />
                </>
              ) : recordMode ? (
                <>
                  <IconButton
                    iconName='calendar'
                    text='어제 까먹은 거 기록할래!'
                    variant={
                      recordType === 'yesterday' ? 'primary' : 'lightgreen'
                    }
                    onPress={() => {
                      setRecordType('yesterday');
                      setMessageKey('archiveYesterday');
                    }}
                  />
                  <IconButton
                    iconName='today'
                    text='오늘 기록할래!'
                    variant={recordType === 'today' ? 'primary' : 'lightgreen'}
                    onPress={() => {
                      setRecordType('today');
                      setMessageKey('archiveToday');
                    }}
                  />
                </>
              ) : null}
            </ThemedView>

            <ThemedView className='flex-row justify-between bg-transparent'>
              <IconButton
                iconName='chatbubble'
                text='나한테 한마디만 해줘'
                onPress={handleAdviceClick}
              />

              {puppyInfo?.isGoal === false ? (
                <IconButton
                  iconName='document-outline'
                  text='목표 설정하기'
                  variant={showGoalOptions ? 'primary' : 'ghost'}
                  onPress={handleShowGoalOptions}
                />
              ) : (
                <IconButton
                  iconName='checkbox'
                  text='음주 기록 할래!'
                  variant={recordMode ? 'primary' : 'ghost'}
                  onPress={handleDrinkRecordPress}
                />
              )}
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
