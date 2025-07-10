import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';

const TOTAL_STEPS = 6;
const BAR_HEIGHT = 5;
const ACTIVE_COLOR = '#0FD380';
const INACTIVE_COLOR = '#E4FAE8';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Answer = { text: string; type: string };
type Question = { question: string; answers: Answer[] };

const questions: Record<number, Question> = {
  1: {
    question: '술자리에 있을 떄 나는..',
    answers: [
      {
        text: '여러 사람과 이야기를 나누며 에너지 얻는다',
        type: 'E',
      },
      {
        text: '조용히 몇 명과 대화하거나 듣는 쪽이 편하다',
        type: 'I',
      },
    ],
  },
  2: {
    question: '퇴근 후 술마시고 싶을 때',
    answers: [
      {
        text: '사람들과 마신다 (E)',
        type: 'E',
      },
      {
        text: '혼자 집에서 조용히 마신다(I)',
        type: 'I',
      },
    ],
  },
  3: {
    question: '친구가 술자리에서 힘든 얘기를 하면 나는…',
    answers: [
      {
        text: '공감하고 위로하며 함께 슬퍼한다',
        type: 'F',
      },
      {
        text: '조언을 해주며 문제 해결을 도와준다',
        type: 'T',
      },
    ],
  },
  4: {
    question: '술 마시고 난 다음날, 내가 먼저 떠올리는 건?',
    answers: [
      {
        text: '어제 친구들과의 감정적 교류',
        type: 'F',
      },
      {
        text: '내가 했던 행동, 말실수, 논리적 복기',
        type: 'T',
      },
    ],
  },
  5: {
    question: '내가 선호하는 술자리는?',
    answers: [
      {
        text: '계획 없이 즉흥적인 번개 술자리',
        type: 'E/F',
      },
      {
        text: '날짜, 장소, 인원 정리된 깔끔한 술자리',
        type: 'I/T',
      },
    ],
  },
  6: {
    question: '내가 술을 마시는 이유는?',
    answers: [
      {
        text: '사람들과의 관계, 감정을 나누기 위해',
        type: 'F',
      },
      {
        text: '스트레스 해소, 사회적 필요',
        type: 'T',
      },
    ],
  },
};

export default function TestProceeding() {
  const [step, setStep] = useState(1);

  const [selected, setSelected] = useState(0); // 0: default, 1: 첫번째, 2: 두번째

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 48,
            width: '100%',
            height: 60,
          }}
        >
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => setStep((s) => Math.max(1, s - 1))}
          >
            <Image
              source={require('@/assets/icons/test/ic_back.svg')}
              style={{ margin: 10 }}
            />
          </TouchableOpacity>
        </View>
        <Progress.Bar
          progress={step / TOTAL_STEPS}
          width={null} // 부모 View 폭 100%
          height={BAR_HEIGHT}
          borderRadius={BAR_HEIGHT / 2}
          borderWidth={0}
          color={ACTIVE_COLOR}
          unfilledColor={INACTIVE_COLOR}
        />

        <View style={styles.pill}>
          <Text style={styles.pillText}>
            <Text style={{ color: ACTIVE_COLOR }}>{step}</Text> / {TOTAL_STEPS}
          </Text>
        </View>

        <Text style={styles.title}>{questions[step].question}</Text>

        <View style={{ gap: 16, width: '100%' }}>
          <TouchableOpacity
            onPress={() => setSelected(1)}
            style={[styles.option, selected === 1 && styles.optionSelected]}
          >
            <Text
              style={[
                styles.optionText,
                selected === 1 && styles.optionTextSelected,
              ]}
            >
              {questions[step].answers[0].text}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelected(2)}
            style={[styles.option, selected === 2 && styles.optionSelected]}
          >
            <Text
              style={[
                styles.optionText,
                selected === 2 && styles.optionTextSelected,
              ]}
            >
              {questions[step].answers[1].text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setSelected(0);
          setStep((s) => Math.min(TOTAL_STEPS, s + 1));
        }}
        style={[styles.bottomBtn, selected !== 0 && styles.bottomBtnActive]}
      >
        다음
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  pill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: INACTIVE_COLOR,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
    lineHeight: 16,
  },
  title: {
    marginTop: (SCREEN_HEIGHT * 20) / 852,
    marginBottom: (SCREEN_HEIGHT * 60) / 852,
    color: '#282828',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  option: {
    width: '100%',
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    backgroundColor: 'rgba(255, 255, 255, 0.00)',
  },
  optionSelected: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00A775',
    backgroundColor: '#F2FFF4',
  },
  optionText: {
    color: '#9D9D9D',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#00A775',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 57 - 16,
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#C1C1C1',
    color: '#F1F1F1',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontStyle: 'normal',
  },
  bottomBtnActive: {
    backgroundColor: '#0FD380',
    color: '#F2FFF4',
  },
});
