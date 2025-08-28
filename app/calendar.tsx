import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
// Get screen dimensions for responsive modal sizing
const { width } = Dimensions.get('window');

// LocaleConfig를 사용해 요일을 한국어로 설정
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  monthTitle: {
    color: '#0FD380',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
  },
  dayWrapper: {
    width: 40,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
  },
  todayContainer: {
    backgroundColor: '#1EBE71', // 오늘 날짜 배경색
  },
  todayText: {
    width: 32,
    color: '#fff',
    borderRadius: 15,
    backgroundColor: '#0FD380',
    textAlign: 'center',
  },
  markedDay: {
    backgroundColor: 'rgba(255, 182, 193, 0.5)', // 연한 핑크색 (곰)
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudMarkedDay: {
    backgroundColor: 'rgba(173, 216, 230, 0.5)', // 연한 파란색 (구름)
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  reportButton: {
    backgroundColor: '#1EBE71',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 24,
    fontWeight: 'bold',
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
    margin: 'auto',
  },
  modalMonthButton: {
    width: '23%',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 23,
  },
  modalMonthText: {
    display: 'flex',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 600,
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
    fontSize: 12,
    fontWeight: 500,

    fontFamily: 'Pretendard',

    fontStyle: 'normal',

    lineHeight: 24,
  },
  backButton: {
    marginTop: 48,
    paddingLeft: 16,
    paddingTop: 18,
    paddingBottom: 18,
  },
  currentMonthText: {
    color: '#555555',
  },
  otherMonthText: {
    color: '#EBEBEB',
  },

  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginTop: 2,
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

interface MarkedDayConfig {
  selected: boolean;
  customStyles: {
    container: object;
  };
  emotion: string;
}

const markedDatesData: { [key: string]: MarkedDayConfig } = {
  '2024-05-01': {
    selected: true,
    customStyles: { container: styles.markedDay },
    emotion: '🐻',
  },
  '2024-05-05': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-06': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-09': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-13': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-14': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-16': {
    selected: true,
    customStyles: { container: styles.markedDay },
    emotion: '🐻',
  },
  '2024-05-24': {
    selected: true,
    customStyles: { container: styles.cloudMarkedDay },
    emotion: '☁️',
  },
  '2024-05-26': {
    selected: true,
    customStyles: { container: styles.todayContainer },
    emotion: '🐶',
  },
};

interface DayComponentProps {
  date?: DateData;
  currentMonth: string;
}

const DayComponent = ({ date, currentMonth }: DayComponentProps) => {
  if (!date) return null;
  const marked = markedDatesData[date.dateString];
  const today = new Date().toISOString().split('T')[0];
  const isToday = date.dateString === today;
  const isCurrentMonth = date.dateString.startsWith(currentMonth);

  if (!isCurrentMonth && date.dateString.substring(0, 7) < currentMonth) {
    return null;
  }
  // const containerStyles = [styles.dayContainer];
  const textStyles = [styles.dayText];
  let statusStyle = styles.statusGray;
  if (marked) {
    if (marked.emotion === '🐻') {
      statusStyle = styles.statusOrange;
    } else if (marked.emotion === '🐶') {
      statusStyle = styles.statusGreen;
    }
  }

  if (isToday) {
    textStyles.push(styles.todayText);
  } else {
    if (!isCurrentMonth) {
      textStyles.push(styles.otherMonthText);
    } else {
      // If not a marked day, make text color #555
      if (!marked) {
        textStyles.push(styles.currentMonthText);
      }
    }
  }

  return (
    <TouchableOpacity style={styles.dayWrapper} onPress={() => {}}>
      <View style={styles.dayContainer}>
        <Text style={[textStyles]}>{date.day}</Text>
        <View style={[styles.statusIndicator, statusStyle]} />
      </View>
    </TouchableOpacity>
  );
};

export default function CalendarPage() {
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date(currentDate).getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(currentDate).getMonth() + 1,
  );
  const router = useRouter();
  const currentMonthName =
    LocaleConfig.locales['ko'].monthNames[new Date(currentDate).getMonth()];

  const handleMonthPress = () => {
    setSelectedYear(new Date(currentDate).getFullYear());
    setSelectedMonth(new Date(currentDate).getMonth() + 1);
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    const newDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    setCurrentDate(newDate);
    setModalVisible(false);
  };

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
    return months.map((month, index) => (
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.headerContainer}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => router.back()} className='w-[8px]'>
              <Image
                className='w-[8px] h-[16px]'
                source={require('@/assets/images/chevron_left.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.header} onPress={handleMonthPress}>
            <Text style={styles.monthTitle}>{currentMonthName}</Text>
            <Image
              className='w-[14px] h-[7px]'
              source={require('@/assets/images/grey_arrow_bottom.png')}
            />
          </TouchableOpacity>
        </View>

        {/* 캘린더 */}
        <Calendar
          key={currentDate}
          current={currentDate}
          markingType={'custom'}
          markedDates={{
            ...markedDatesData,
            [currentDate]: {
              selected: true,
              customStyles: markedDatesData[currentDate]?.customStyles,
            },
          }}
          dayComponent={(dayProps) => (
            <DayComponent
              {...dayProps}
              currentMonth={currentDate.substring(0, 7)}
            />
          )}
          hideArrows={true}
          enableSwipeMonths={false}
          renderHeader={() => null}
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2d4150',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        {/* 하단 버튼 */}
        <View style={styles.footer} className=''>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push('/report')}
          >
            <Text style={styles.reportButtonText}>음주 주간 리포트 보기</Text>
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
                  <Text style={styles.modalTitle}>{selectedYear}</Text>
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
              >
                <Text style={styles.modalConfirmText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
