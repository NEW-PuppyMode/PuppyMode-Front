/* eslint-disable @typescript-eslint/no-require-imports */
import CalendarTodayIcon from '@/assets/icons/home/ic_calendar_t.svg';
import CalendarVIcon from '@/assets/icons/home/ic_calendar_v.svg';
import CalendarYesterdayIcon from '@/assets/icons/home/ic_calendar_y.svg';
import SetGoalIcon from '@/assets/icons/home/ic_file.svg';
import PastGoalIcon from '@/assets/icons/home/ic_file_minus.svg';
import NewGoalIcon from '@/assets/icons/home/ic_file_plus.svg';
import PawIcon from '@/assets/icons/home/ic_footprint.svg';
import MessageIcon from '@/assets/icons/home/ic_message.svg';
import PersonIcon from '@/assets/icons/home/ic_person.svg';
import { TextInput } from '@/components/common/Inputs/TextInput';
import { ChoiceButton } from '@/components/page/home/ChoiceButton';
import { ControlButton } from '@/components/page/home/ControlButton';
import { IconButton } from '@/components/page/home/IconButton';
import { SpeechBubble } from '@/components/page/home/SpeechBubble';
import { TopBar } from '@/components/page/home/TopBar';
import { UpdatePopupModal } from '@/components/page/home/UpdatePopupModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import { APP_VERSION } from '@/constants/appVersion';
import { PUPPY_MESSAGES } from '@/constants/messages';
import { useAdvicePuppyMutation } from '@/hooks/mutations/useAdvicePuppyMutation';
import { useCreateDrinkHistoryMutation } from '@/hooks/mutations/useCreateDrinkHistoryMutation';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { useRenamePuppyMutation } from '@/hooks/mutations/useRenamePuppyMutation';
import { useRenameUserMutation } from '@/hooks/mutations/useRenameUserMutation';
import { useIsRecordedQuery } from '@/hooks/queries/useIsRecordedQuery';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { useRecentGoalQuery } from '@/hooks/queries/useRecentGoalQuery';
import { useVersionCheckQuery } from '@/hooks/queries/useVersionCheckQuery';
import { logButtonTap } from '@/utils/analytics';
import { maxDaysInMonth } from '@/utils/dateUtils';
import { getPuppyGifSource } from '@/utils/dogMapper';
import { throttle } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// import Gif from 'react-native-gif';
import { Image as Gif } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const renamePuppyMutation = useRenamePuppyMutation();
  const renameUserMutation = useRenameUserMutation();
  const advicePuppyMutation = useAdvicePuppyMutation();
  const createDrinkHistoryMutation = useCreateDrinkHistoryMutation();
  const createGoalMutation = useCreateGoalMutation();

  const {
    data: puppyInfo,
    isLoading,
    isFetching,
    isError,
  } = usePuppyInfoQuery();
  const { data: isRecorded } = useIsRecordedQuery();
  const { data: recentGoal } = useRecentGoalQuery();
  const { data: versionData } = useVersionCheckQuery();

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

  // 키보드용 상태 변수
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const [reaction, setReaction] = useState<'normal' | 'angry' | 'heart'>(
    'normal',
  );
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!versionData) return;
    if (versionData.updateRequired || versionData.updateAvailable) {
      setShowUpdatePopup(true);
    }
  }, [versionData]);

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
    logButtonTap('drink_record');
    setShowMessage(true);
    setRecordMode(!recordMode);
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
    setMessageKey('default');
    setAdviceMessage('');
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setShowNameInput(false);
    setInputType(null);
    setRecordType(null);
    setMessageKey('default');
  };

  const handleShowGoalOptions = () => {
    setShowNameInput(false);
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

  const DOG_NAME_MESSAGES = [
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text> 이라니 너무 마음에 들어요.</Text>
      </>
    ),
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text> 이라니 완전 감다살이네요.</Text>
      </>
    ),
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text>… 제게도 이제 이름이 생겼네요. 감사해요.</Text>
      </>
    ),
  ];

  const USER_NAME_MESSAGES = [
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text>이군요… 앞으로 쭉 기억할게요.</Text>
      </>
    ),
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text>… 이제야 제대로 부를 수 있겠네요.</Text>
      </>
    ),
    (name: string) => (
      <>
        <Text style={{ color: '#21D08A', fontWeight: 'bold' }}>{name}</Text>
        <Text>… 앞으로 더 소중히 부를게요.</Text>
      </>
    ),
  ];

  const handleRenameComplete = async () => {
    try {
      if (inputType === 'dog' && dogName.trim()) {
        await renamePuppyMutation.mutateAsync(dogName);
        setShowMessage(true);
        const randomIndex = Math.floor(
          Math.random() * DOG_NAME_MESSAGES.length,
        );
        setRenameMessage(DOG_NAME_MESSAGES[randomIndex](dogName));
        setDogName('');
        setShowNameInput(false);
        setInputType(null);
      } else if (inputType === 'user' && userName.trim()) {
        await renameUserMutation.mutateAsync(userName);
        setShowMessage(true);
        const randomIndex = Math.floor(
          Math.random() * USER_NAME_MESSAGES.length,
        );
        setRenameMessage(USER_NAME_MESSAGES[randomIndex](userName));
        setUserName('');
        setShowNameInput(false);
        setInputType(null);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  // onboarded 라우팅 (한 번만 실행, 서버 응답 확정 후에만)
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (!puppyInfo || isFetching || hasRedirectedRef.current) return;

    if (puppyInfo.isOnboarded === false) {
      hasRedirectedRef.current = true;
      router.replace('/test/start');
    }
  }, [puppyInfo, isFetching]);

  const _handleAdviceClick = async () => {
    logButtonTap('advice');
    try {
      const result = await advicePuppyMutation.mutateAsync();
      setAdviceMessage(result.result.advice || '');
    } catch {
      setAdviceMessage('');
      setMessageKey('default');
    }
    setRenameMessage('');
    setShowGoalOptions(false);
    setRecordMode(false);
    setShowMessage(true);
  };

  const handleAdviceClick = useMemo(
    () =>
      throttle(_handleAdviceClick, 3000, {
        leading: true,
        trailing: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      (handleAdviceClick as any).cancel?.();
    };
  }, [handleAdviceClick]);

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, []);

  const level = puppyInfo?.puppyLevel ?? 0;
  const percent = puppyInfo?.puppyLevelPercent ?? 0;
  const displayName = puppyInfo?.puppyLevelName; // 강아지 종 ex)눈송이 비숑
  const puppyName = puppyInfo?.currentPuppyName; // 강아지 이름

  // const displayName = puppyInfo?.puppyLevelName
  //   ? puppyInfo.puppyLevelName
  //   : '눈송이 비숑';

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

  const handleRecordDrinkHistory = async (didDrink: boolean) => {
    try {
      setMessageKey('archiveSuccess');
      setRecordMode(false);
      setRecordType(null);

      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      setReaction(didDrink ? 'angry' : 'heart');
      reactionTimerRef.current = setTimeout(() => setReaction('normal'), 2000);

      const drinkDate = new Date();
      if (recordType === 'yesterday') {
        drinkDate.setDate(drinkDate.getDate() - 1);
      }
      const formattedDate = drinkDate.toISOString().slice(0, 10);

      await createDrinkHistoryMutation.mutateAsync({
        drinkDate: formattedDate,
        isDrink: didDrink,
      });
    } catch (error) {
      console.error('음주 기록 처리 중 오류 발생:', error);
    }
  };

  // 입력창 키보드 애니메이션
  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: e.endCoordinates.height - bottomPanelHeight,
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [bottomPanelHeight, keyboardAnim]);

  if (isLoading) {
    return null; // 추후 로딩 UI 추가
  }
  if (isError) {
    return null;
    // 추후 에러 UI 추가 (문제가 생겼습니다, 로그인 화면으로 이동? 상의 필요)
  }

  // F3 검색용(임시, 차후 삭제)
  // 01(TopBar), 02(동기부여), 03(강아지), 04(하단 컴포넌트)
  return (
    <ImageBackground
      source={require('../assets/images/home_background.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <SafeAreaView
        style={styles.background}
        className='flex flex-column justify-between items-center'
      >
        {/* ===== 실제 UI 레이어 ===== */}
        <TopBar
          level={level}
          displayName={displayName ?? ''}
          percent={percent}
        />

        <ThemedView className='flex-1 w-full h-full px-4 bg-transparent'>
          {/* ===== 동기부여 메시지 ===== */}
          <View className='justify-center pt-4 h-20 bg-transparent'>
            {showMessage && (
              <View className='absolute top-0 w-full'>
                <SpeechBubble>
                  {renameMessage || adviceMessage || PUPPY_MESSAGES[messageKey]}
                </SpeechBubble>
              </View>
            )}
          </View>

          {/* ===== 하단 컴포넌트 묶음 ===== */}
          {/* shadow-lg */}
          <ThemedView className='flex-1 w-full h-full flex-column justify-between justify-end bg-transparent'>
            {/* ===== 키보드 - 이름 설정 입력창 ===== */}
            {showNameInput && (
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: bottomPanelHeight + 12,
                  zIndex: 10,
                  transform: [
                    {
                      translateY: Animated.multiply(keyboardAnim, -1),
                    },
                  ],
                }}
              >
                <ThemedView className='p-0 mb-6 bg-transparent rounded-xl justify-end'>
                  <ThemedView className='flex-row justify-between mb-2 bg-transparent'>
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
              </Animated.View>
            )}

            {/* ===== 음주 기록 - 술 섭취 유무 ===== */}
            {recordMode && recordType && (
              <ThemedView
                className='bg-transparent rounded-xl pb-3'
                style={{
                  width: '100%',
                  zIndex: 10,
                }}
              >
                <ThemedView
                  className='flex-row mb-2 bg-transparent'
                  style={{
                    justifyContent:
                      recordType === 'yesterday' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <SpeechBubble
                    variant='user'
                    onPress={() => handleRecordDrinkHistory(true)}
                  >
                    술 마셨어!
                  </SpeechBubble>
                  <ThemedView className='w-[10px] bg-transparent' />
                  <SpeechBubble
                    variant='user'
                    onPress={() => handleRecordDrinkHistory(false)}
                  >
                    술 안 마셨어!
                  </SpeechBubble>
                </ThemedView>
              </ThemedView>
            )}

            {/* ===== 술 목표 설정 ===== */}
            {showGoalOptions && showGoalInput && (
              <ThemedView
                className='mb-16 bg-transparent rounded-xl'
                style={{
                  width: '100%',
                  zIndex: 10,
                }}
              >
                <ThemedView className='flex-row items-center justify-between bg-transparent'>
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

                    <ThemedView className='px-5 py-3 mx-1 bg-green-100 shadow-sm rounded-2xl'>
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
                      onPress={() =>
                        setGoalCount((n) => Math.min(maxDaysInMonth, n + 1))
                      }
                      style={{
                        opacity: 0.9,
                      }}
                    />
                  </ThemedView>

                  <ChoiceButton
                    label='작성 완료'
                    variant='primary'
                    onPress={async () => {
                      await createGoalMutation.mutateAsync({
                        goal: goalCount,
                        isNew: true,
                      });
                      setShowGoalInput(false);
                      setShowGoalOptions(false);
                      setGoalCount(0);
                    }}
                    style={{
                      opacity: 0.7,
                    }}
                  />
                </ThemedView>
              </ThemedView>
            )}

            {/* ===== 하단 컴포넌트 버튼 ===== */}
            <ThemedView className='justify-end w-full h-40 bg-transparent pb-4'>
              <ThemedView
                className='flex-col p-5 px-4 border border-gray-200 rounded-2xl bg-cream-200'
                onLayout={(e) => {
                  setBottomPanelHeight(e.nativeEvent.layout.height);
                }}
              >
                <ThemedView className='flex-row justify-between bg-transparent'>
                  {showGoalOptions ? (
                    <View className='flex-row justify-between flex-1 mb-4 space-x-2 bg-transparent'>
                      <IconButton
                        icon={<PastGoalIcon width={24} height={24} />}
                        text='지난 달이랑 똑같아!'
                        variant={goalType === 'same' ? 'primary' : 'lightgreen'}
                        onPress={async () => {
                          setGoalType('same');
                          setShowGoalInput(false);
                          setShowGoalOptions(false);

                          await createGoalMutation.mutateAsync({
                            goal: 0,
                            isNew: false,
                          });
                        }}
                        disabled={!recentGoal}
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
                    <View className='flex-row justify-between flex-1 mb-4 space-x-2 bg-transparent'>
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
                    <View className='flex-row justify-between flex-1 mb-4 space-x-2 bg-transparent'>
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
                        disabled={
                          isRecorded && isRecorded.todayRecorded === true
                        }
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

                  {puppyInfo?.isGoal === false ? (
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

        {/* ===== 업데이트 팝업 모달 ===== */}
        <UpdatePopupModal
          visible={showUpdatePopup}
          updateRequired={versionData?.updateRequired ?? false}
          onLater={() => setShowUpdatePopup(false)}
          onUpdate={() => {
            if (versionData?.updateUrl) {
              Linking.openURL(versionData.updateUrl);
            }
            setShowUpdatePopup(false);
          }}
        />

        {/* ===== 강아지 Gif 레이어 ===== */}
        {/* {isFetching && <LoadingOverlay />} */}
        {/* 이런식으로 추후에 데이터 패칭 중 -> 로딩 UI 추가하기 */}
        <View pointerEvents='none' style={styles.gifLayer}>
          <Gif
            source={getPuppyGifSource(displayName ?? '', level, reaction)}
            style={{
              width: 240,
              height: 240,
            }}
            contentFit='contain'
            autoplay
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gifLayer: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
