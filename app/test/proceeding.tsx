import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { TestApi } from '@/services/testData';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_STEPS = 6;
const BAR_HEIGHT = 5;
const ACTIVE_COLOR = '#0FD380';
const INACTIVE_COLOR = '#E4FAE8';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Answer = { text: string; type: number };
type Question = { question: string; answers: Answer[] };

const questions: Question[] = [
  {
    question: '',
    answers: [{ text: '', type: 0 }],
  },
  {
    question: '술자리에 있을 때 나는..',
    answers: [
      {
        text: '여러 사람과 이야기를 나누며 에너지를 얻는다',
        type: 1,
      },
      {
        text: '조용히 몇 명과 대화하거나 듣는 쪽이 편하다',
        type: 2,
      },
    ],
  },
  {
    question: '퇴근 후 술마시고 싶을 때',
    answers: [
      {
        text: '사람들과 마신다',
        type: 1,
      },
      {
        text: '혼자 집에서 조용히 마신다',
        type: 2,
      },
    ],
  },
  {
    question: '친구가 술자리에서 힘든 얘기를 하면 나는…',
    answers: [
      {
        text: '공감하고 위로하며 함께 슬퍼한다',
        type: 1,
      },
      {
        text: '조언을 해주며 문제 해결을 도와준다',
        type: 2,
      },
    ],
  },
  {
    question: '술 마시고 난 다음날, 내가 먼저 떠올리는 건?',
    answers: [
      {
        text: '어제 친구들과의 감정적 교류',
        type: 1,
      },
      {
        text: '내가 했던 행동, 말실수, 논리적 복기',
        type: 2,
      },
    ],
  },
  {
    question: '내가 선호하는 술자리는?',
    answers: [
      {
        text: '계획 없이 즉흥적인 번개 술자리',
        type: 1,
      },
      {
        text: '날짜, 장소, 인원 정리된 깔끔한 술자리',
        type: 2,
      },
    ],
  },
  {
    question: '내가 술을 마시는 이유는?',
    answers: [
      {
        text: '사람들과의 관계, 감정을 나누기 위해',
        type: 1,
      },
      {
        text: '스트레스 해소, 사회적 필요',
        type: 2,
      },
    ],
  },
];

export default function TestProceeding() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]); // 0: default, 1: 첫번째, 2: 두번째. 0번째 index dummy

  const onPressSelectBtn = (currentStep: number, answer: number) => {
    const newSelected = [...selected];
    newSelected[currentStep] = answer;
    setSelected(newSelected);
  };

  const onPressNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      const answers = questions
        .slice(1) // 0번 dummy 제외
        .map((_, index) => ({
          questionId: index + 1,
          answer: selected[index + 1],
        }));

      try {
        const res = await TestApi.submitTest(answers);

        console.log('제출 성공:', res.message);
        console.log('제출 성공:', res.result);

        // 검사를 마쳤으니 진입 판정의 근거가 되는 서버 상태를 새로 받는다.
        // useMeQuery는 staleTime: Infinity라 무효화하지 않으면 "검사 미완료"가
        // 캐시에 남아, 다음 진입에서 app/index.tsx가 검사로 다시 보낸다.
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.puppyInfo,
        });

        router.replace({
          pathname: '/test/result',
          params: { result: JSON.stringify(res.result) },
        });
      } catch (e) {
        console.error('제출 실패 :', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            height: 60,
          }}
        >
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => {
              if (step !== 1) {
                setStep((s) => Math.max(1, s - 1));
              }
            }}
          >
            <Image
              source={require('@/assets/images/chevron_left.png')}
              style={{ width: 8, height: 16 }}
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
            <Text style={{ color: '#00A775' }}>{step}</Text> / {TOTAL_STEPS}
          </Text>
        </View>

        <Text style={styles.title}>{questions[step]?.question || ''}</Text>

        <View style={{ gap: 16, width: '100%' }}>
          <TouchableOpacity
            onPress={() => onPressSelectBtn(step, 1)}
            style={[
              styles.option,
              selected[step] === 1 && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected[step] === 1 && styles.optionTextSelected,
              ]}
            >
              {questions[step]?.answers[0]?.text || ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onPressSelectBtn(step, 2)}
            style={[
              styles.option,
              selected[step] === 2 && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected[step] === 2 && styles.optionTextSelected,
              ]}
            >
              {questions[step]?.answers[1]?.text || ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <PrimaryButton
        title='다음'
        onPress={onPressNext}
        disabled={selected[step] === 0}
      />
    </SafeAreaView>
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
    marginTop: 27,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: INACTIVE_COLOR,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A6DCCC',
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
});
