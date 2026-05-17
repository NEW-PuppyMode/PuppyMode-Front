import { useCalendarQuery } from '@/hooks/queries/useCalendarQuery';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import Svg, { Circle, Path } from 'react-native-svg';
const { width } = Dimensions.get('window');

// ----- 한글 로케일 설정 -----
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// ----- 스타일 -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },

  dayText: {
    fontSize: 16,
  },
  dayContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  todayText: {
    width: 32,
    color: '#fff',
    borderRadius: 15,
    backgroundColor: '#0FD380',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * (336 / 393),
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'column',

    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    width: 96,
    textAlign: 'center',
  },
  modalYearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    width: '100%',
    marginBottom: 19,
  },
  modalMonthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: (197 / 393) * width,
    alignSelf: 'center',
  },
  modalMonthButton: {
    width: '23%',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 23,
    padding: 1,
  },
  modalMonthText: {
    display: 'flex',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    alignItems: 'center',
  },
  modalActiveMonth: {
    backgroundColor: '#1EBE71',
  },
  modalActiveMonthText: {
    color: '#fff',
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  modalConfirmButton: {
    backgroundColor: '#1EBE71',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
  },

  currentMonthText: {
    color: '#555555',
  },
  otherMonthText: {
    color: '#EBEBEB',
  },

  statusOrange: {
    backgroundColor: '#FF8A00', // 주황색
  },
  statusGreen: {
    backgroundColor: '#1EBE71', // 초록색
  },
  statusGray: {
    backgroundColor: '#FBFBFB', // 회색
  },
});

// ----- 캘린더 markedDates 타입 -----
interface MarkedDayConfig {
  selected: boolean;
  customStyles: {
    container: object;
  };
  isDrink: boolean | null;
}
type MarkedDatesMap = Record<string, MarkedDayConfig>;

// ----- DayComponent: 한 날짜 셀을 렌더링 -----
interface DayComponentProps {
  date?: DateData;
  currentMonth: string; // 'YYYY-MM'
  markedDates: MarkedDatesMap; // API에서 매핑된 데이터
}

const DayComponent = ({
  date,
  currentMonth,
  markedDates,
}: DayComponentProps) => {
  if (!date) return null;
  const marked = markedDates[date.dateString];
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const isToday = date.dateString === today;
  const isCurrentMonth = date.dateString.startsWith(currentMonth);

  if (!isCurrentMonth && date.dateString.substring(0, 7) < currentMonth) {
    return null;
  }
  // const containerStyles = [styles.dayContainer];
  const textStyles = [styles.dayText];
  let statusImage = require('@/assets/images/unmarked_drink.png'); // 디폴트 (회색)
  if (marked?.isDrink === true) {
    statusImage = require('@/assets/images/drink.png'); // 주황
  } else if (marked?.isDrink === false) {
    statusImage = require('@/assets/images/not_drink.png'); // 초록
  }

  if (isToday) {
    textStyles.push({ ...styles.todayText, fontSize: 16 });
  } else if (!isCurrentMonth) {
    textStyles.push({ ...styles.otherMonthText, fontSize: 16 });
  } else {
    // 🟢 여기서 미래 날짜 처리
    if (date.dateString > today) {
      textStyles.push({ ...styles.otherMonthText, fontSize: 16 }); // 회색 처리
    } else if (!marked) {
      textStyles.push({ ...styles.currentMonthText, fontSize: 16 });
    }
  }

  return (
    <TouchableOpacity className='w-10 h-[66px] items-center justify-center'>
      <View className='items-center justify-center w-10 h-10 rounded-full'>
        <Text style={[textStyles]}>{date.day}</Text>
        <Image
          source={statusImage}
          style={{ width: 40, height: 40, marginTop: 2 }}
          resizeMode='contain'
        />
      </View>
    </TouchableOpacity>
  );
};

export default function CalendarPage() {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const [currentDate, setCurrentDate] = useState(today); // 'YYYY-MM-DD'

  // 월 선택 모달 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date(currentDate).getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentDate).getMonth() + 1,
  );

  const router = useRouter();

  const calendarYear = new Date(currentDate).getFullYear();
  const calendarMonth = new Date(currentDate).getMonth() + 1;
  const { data: calendarData, isLoading } = useCalendarQuery(
    calendarYear,
    calendarMonth,
  );

  // API 배열을 markedDates 형태로 매핑
  const mapApiToMarkedDates = (
    rows: { date: string; isDrink: boolean }[],
  ): MarkedDatesMap => {
    const map: MarkedDatesMap = {};
    rows.forEach(({ date, isDrink }) => {
      map[date] = {
        selected: true,
        customStyles: { container: styles.dayContainer },
        isDrink,
      };
    });
    return map;
  };

  const markedDates = useMemo(
    () => (calendarData ? mapApiToMarkedDates(calendarData) : {}),
    [calendarData],
  );

  const currentMonthName =
    LocaleConfig.locales['ko'].monthNames[new Date(currentDate).getMonth()];

  const handleMonthPress = () => {
    setSelectedYear(new Date(currentDate).getFullYear());
    setSelectedMonth(new Date(currentDate).getMonth() + 1);
    setModalVisible(true);
  };

  // 모달 확인: currentDate 갱신 → query key 변경으로 자동 재요청
  const handleModalConfirm = () => {
    const newDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    setCurrentDate(newDate);
    setModalVisible(false);
  };

  // 월/년 증감
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };
  const handleYearChange = (direction: 'prev' | 'next') => {
    setSelectedYear((prevYear) =>
      direction === 'next' ? prevYear + 1 : prevYear - 1,
    );
  };

  const renderMonths = () => {
    const months = LocaleConfig.locales['ko'].monthNamesShort;
    return months.map((month: string, index: number) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.modalMonthButton,
          selectedMonth === index + 1 && styles.modalActiveMonth,
        ]}
        onPress={() => handleMonthChange(index + 1)}
      >
        <Text
          style={[
            styles.modalMonthText,
            selectedMonth === index + 1 && styles.modalActiveMonthText,
          ]}
        >
          {month}
        </Text>
      </TouchableOpacity>
    ));
  };

  const mergedMarkedDates = useMemo<MarkedDatesMap>(() => {
    return {
      ...markedDates,
      [currentDate]: {
        ...(markedDates[currentDate] ?? {
          selected: true,
          customStyles: { container: styles.dayContainer },
          isDrink: null, // 오늘은 점 색상 없음(회색) 유지. 필요 시 true/false로 지정 가능
        }),
      },
    };
  }, [markedDates, currentDate]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View className='px-[20px] mt-12 h-[60px] justify-center'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='px-[8px] py-[6px]'
          >
            <Image
              className='w-[8px] h-[16px]'
              source={require('@/assets/images/chevron_left.png')}
            />
          </TouchableOpacity>
        </View>

        <View className='flex-row items-center justify-center mt-5'>
          <TouchableOpacity
            className='flex-row items-center justify-center gap-2 '
            onPress={handleMonthPress}
            disabled={isLoading}
          >
            <Text className='text-[#0FD380] text-center text-[30px] font-extrabold'>
              {currentMonthName}
            </Text>
            <Image
              className='w-[14px] h-[7px]'
              source={require('@/assets/images/grey_arrow_bottom.png')}
            />
          </TouchableOpacity>
        </View>

        <View className='px-2'>
          {/* 캘린더 */}
          <Calendar
            key={currentDate}
            current={currentDate}
            markingType={'custom'}
            markedDates={mergedMarkedDates}
            dayComponent={(dayProps) => (
              <DayComponent
                {...dayProps}
                currentMonth={currentDate.substring(0, 7)}
                markedDates={mergedMarkedDates}
              />
            )}
            hideArrows={true}
            enableSwipeMonths={false}
            renderHeader={() => null}
            hideExtraDays={true}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#2d4150',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              textDayFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        {/* 하단 버튼 */}
        <View className='absolute w-full p-5 bottom-11'>
          <TouchableOpacity
            className='bg-[#1EBE71] rounded-[10px] p-[18px] items-center'
            onPress={() =>
              router.push({
                pathname: '/report',
                params: { year: selectedYear, month: selectedMonth },
              })
            }
          >
            <Text className='text-white text-[18px] font-bold'>
              음주 리포트 보기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 월 선택 모달 */}
        <Modal
          animationType='fade'
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalYearSelector}>
                  <TouchableOpacity onPress={() => handleYearChange('prev')}>
                    <Svg width={24} height={24} viewBox='0 0 24 24' fill='none'>
                      <Circle
                        cx={12}
                        cy={12}
                        r={11.5}
                        transform='matrix(-1 0 0 1 24 0)'
                        stroke='#868686'
                      />
                      <Path
                        d='M14.6084 7.30078L9.91275 11.9964L14.6084 16.6921'
                        stroke='#868686'
                      />
                    </Svg>
                  </TouchableOpacity>
                  <Text
                    style={styles.modalTitle}
                    className='text-lg font-semibold'
                  >
                    {selectedYear}
                  </Text>
                  <TouchableOpacity onPress={() => handleYearChange('next')}>
                    <Svg width={24} height={24} viewBox='0 0 24 24' fill='none'>
                      <Circle cx={12} cy={12} r={11.5} stroke='#868686' />
                      <Path
                        d='M9.3916 7.30078L14.0873 11.9964L9.3916 16.6921'
                        stroke='#868686'
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Svg
                  width={(336 / 393) * width}
                  height={2}
                  viewBox='0 0 336 2'
                  fill='none'
                >
                  <Path
                    d='M1.5 1L334.5 0.999971'
                    stroke='#F1F1F1'
                    strokeWidth='2'
                    strokeLinecap='square'
                    strokeLinejoin='round'
                  />
                </Svg>
              </View>

              <View style={styles.modalMonthContainer}>{renderMonths()}</View>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleModalConfirm}
                disabled={isLoading}
              >
                <Text
                  style={styles.modalConfirmText}
                  className='text-xs font-medium'
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
