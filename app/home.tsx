/* eslint-disable @typescript-eslint/no-require-imports */
import CalendarIcon from '@/assets/icons/home/ic_calendar.svg';
import CalendarTodayIcon from '@/assets/icons/home/ic_calendar_t.svg';
import CalendarVIcon from '@/assets/icons/home/ic_calendar_v.svg';
import CalendarYesterdayIcon from '@/assets/icons/home/ic_calendar_y.svg';
import SetGoalIcon from '@/assets/icons/home/ic_file.svg';
import NewGoalIcon from '@/assets/icons/home/ic_file_plus.svg';
import PawIcon from '@/assets/icons/home/ic_footprint.svg';
import MessageIcon from '@/assets/icons/home/ic_message.svg';
import PersonIcon from '@/assets/icons/home/ic_person.svg';
import DogShadowImage from '@/assets/images/dog_shadow.svg';
import { TextInput } from '@/components/common/Inputs/TextInput';
import { ChoiceButton } from '@/components/page/home/ChoiceButton';
import { ControlButton } from '@/components/page/home/ControlButton';
import { IconButton } from '@/components/page/home/IconButton';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import { TopBar } from '@/components/page/home/TopBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PUPPY_MESSAGES } from '@/constants/messages';
import { usePuppyData } from '@/hooks/usePuppyData';
import { IsRecorded, RecentGoal } from '@/types/models/puppy';
import { getPuppyGifSource } from '@/utils/dogMapper';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Gif from 'react-native-gif';

export default function HomeScreen() {
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
  const [showMessage, setShowMessage] = useState(false);

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
    setShowMessage(true);
    setShowGoalInput(true);
    setGoalType('new');
    setMessageKey('makeNewGoal');
  };

  const handleDogNameButtonPress = () => {
    setShowMessage(true);
    setInputType('dog');
    setShowNameInput(true);
    setMessageKey('namingPuppy');
  };

  const handleUserNameButtonPress = () => {
    setShowMessage(true);
    setInputType('user');
    setShowNameInput(true);
    setMessageKey('namingUser');
  };

  const handleDrinkRecordPress = () => {
    setShowMessage(true);
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
    setShowMessage(true);
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
          setShowMessage(true);
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
          setShowMessage(true);
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
    setShowMessage(true);
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

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessageKey('default');
        setAdviceMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <ImageBackground
      source={require('../assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <TopBar level={level} displayName={displayName} percent={percent} />

      <ThemedView className='flex-1 px-4 bg-transparent'>
        <View className='h-44 pt-4 justify-center'>
          {showMessage && (
            <View className='absolute top-0 w-full'>
              <SpeechBubble>
                {renameMessage || adviceMessage || PUPPY_MESSAGES[messageKey]}
              </SpeechBubble>
            </View>
          )}
        </View>

        <ThemedView className='absolute left-0 right-0 bottom-24 flex-1 justify-center items-center relative bg-transparent'>
          <DogShadowImage
            width={150}
            height={150}
            style={{ position: 'absolute', bottom: 120, left: 105 }}
          />

          <Gif
            source={getPuppyGifSource(puppyInfo?.puppyLevelName ?? '', level)}
            style={{ width: 240, height: 240, position: 'absolute' }}
            resizeMode='contain'
          />
        </ThemedView>

        <ThemedView className='rounded-2xl bg-transparent shadow-lg'>
          {/* 이름 설정 */}
          {showNameInput && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                position: 'absolute',
                top: -320,
                left: -15,
                right: -15,
                zIndex: 10,
              }}
            >
              <ThemedView className='mb-6 bg-transparent rounded-xl p-4'>
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
            </KeyboardAvoidingView>
          )}

          {/* 음주 기록 */}
          {recordMode && recordType && (
            <ThemedView
              className='bg-transparent rounded-xl p-4'
              style={{
                position: 'absolute',
                top: -300,
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
                    console.log(drinkDate.getDate() - 1);
                    console.log(drinkDate.getDate());
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
                top: -270,
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
                  style={{
                    opacity: 0.9,
                  }}
                />

                <ThemedView className='flex-row items-center justify-between bg-transparent'>
                  <ControlButton
                    label='-'
                    onPress={() => setGoalCount((n) => Math.max(1, n - 1))}
                    style={{
                      opacity: 0.9,
                    }}
                  />

                  <ThemedView className='bg-green-100 rounded-2xl px-6 py-3 mx-1 shadow-sm'>
                    <ThemedText
                      style={{
                        color: '#21D08A',
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                      className='text-green-500'
                    >
                      {goalCount}번
                    </ThemedText>
                  </ThemedView>

                  <ControlButton
                    label='+'
                    onPress={() => setGoalCount((n) => n + 1)}
                    style={{
                      opacity: 0.9,
                    }}
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
                  style={{
                    opacity: 0.7,
                  }}
                />
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView className='absolute left-0 right-0 bottom-10 bg-transparent justify-center h-40'>
            <ThemedView className='flex-col rounded-2xl p-5 px-4 bg-cream-200 border border-gray-200'>
              <ThemedView className='flex-row justify-between bg-transparent'>
                {showGoalOptions ? (
                  <View className='flex-1 flex-row justify-between space-x-2 bg-transparent mb-4'>
                    <IconButton
                      icon={<CalendarIcon width={24} height={24} />}
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
                      icon={<NewGoalIcon width={24} height={24} />}
                      text='새로운 목표로 가자!'
                      variant={goalType === 'new' ? 'primary' : 'lightgreen'}
                      onPress={handleNewGoalClick}
                    />
                  </View>
                ) : !recordMode &&
                  !(puppyInfo?.isPuppyName && puppyInfo?.isMyName) ? (
                  <View className='flex-1 flex-row justify-between space-x-2 bg-transparent mb-4'>
                    <IconButton
                      icon={<PawIcon width={24} height={24} />}
                      text='강아지 이름 지어주기'
                      variant={inputType === 'dog' ? 'primary' : 'ghost'}
                      onPress={handleDogNameButtonPress}
                      disabled={puppyInfo?.isPuppyName === true}
                    />
                    <IconButton
                      icon={<PersonIcon width={24} height={24} />}
                      text='내 이름 알려주기'
                      variant={inputType === 'user' ? 'primary' : 'ghost'}
                      onPress={handleUserNameButtonPress}
                      disabled={puppyInfo?.isMyName === true}
                    />
                  </View>
                ) : recordMode ? (
                  <View className='flex-1 flex-row justify-between space-x-2 bg-transparent mb-4'>
                    <IconButton
                      icon={<CalendarYesterdayIcon width={24} height={24} />}
                      text='어제 거 기록할래!'
                      variant={
                        recordType === 'yesterday' ? 'primary' : 'lightgreen'
                      }
                      onPress={() => {
                        setRecordType('yesterday');
                        setMessageKey('archiveYesterday');
                      }}
                      disabled={
                        isRecorded && isRecorded.yesterdayRecorded === true
                      }
                    />
                    <IconButton
                      icon={<CalendarTodayIcon width={24} height={24} />}
                      text='오늘 기록할래!'
                      variant={
                        recordType === 'today' ? 'primary' : 'lightgreen'
                      }
                      onPress={() => {
                        setRecordType('today');
                        setMessageKey('archiveToday');
                      }}
                      disabled={isRecorded && isRecorded.todayRecorded === true}
                    />
                  </View>
                ) : null}
              </ThemedView>

              <ThemedView className='flex-row justify-between space-x-2 bg-transparent'>
                <IconButton
                  icon={<MessageIcon width={24} height={24} />}
                  text='나한테 한마디만 해줘'
                  onPress={handleAdviceClick}
                />

                {puppyInfo?.isGoal === false && goal30daysPassed === false ? (
                  <IconButton
                    icon={<SetGoalIcon width={24} height={24} />}
                    text='목표 설정하기'
                    variant={showGoalOptions ? 'primary' : 'ghost'}
                    onPress={handleShowGoalOptions}
                  />
                ) : (
                  <IconButton
                    icon={<CalendarVIcon width={24} height={24} />}
                    text='음주 기록 할래!'
                    variant={recordMode ? 'primary' : 'ghost'}
                    onPress={handleDrinkRecordPress}
                  />
                )}
              </ThemedView>
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
