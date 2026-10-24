import { getCalendarDogImage } from '@/utils/dogMapper';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type YesterdayDrinkChoiceProps = {
  /** 고른 값. 아직 고르지 않았으면 null */
  value: boolean | null;
  onChange: (isDrink: boolean) => void;
  /** 강아지 종(한글). 카드 아이콘을 캘린더와 같은 견종 아이콘으로 보여준다. */
  breed: string;
  disabled?: boolean;
};

/**
 * 월간 리포트 앞의 '어제 술 마셨어요?' 선택 카드 두 개.
 * 목표 갱신 화면의 어제 기록 스텝에서 GoalCounter 자리에 들어간다.
 */
export function YesterdayDrinkChoice({
  value,
  onChange,
  breed,
  disabled = false,
}: YesterdayDrinkChoiceProps) {
  return (
    <View style={styles.row}>
      <ChoiceCard
        label='어제 술 마셨어!'
        icon={getCalendarDogImage(breed, true)}
        selected={value === true}
        onPress={() => onChange(true)}
        disabled={disabled}
      />
      <ChoiceCard
        label='어제 안 마셨어!'
        icon={getCalendarDogImage(breed, false)}
        selected={value === false}
        onPress={() => onChange(false)}
        disabled={disabled}
      />
    </View>
  );
}

function ChoiceCard({
  label,
  icon,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  icon: ReturnType<typeof getCalendarDogImage>;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='radio'
      accessibilityState={{ selected, disabled }}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    paddingVertical: 12,
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 15,
    // 선택 시 테두리가 생겨도 내용이 밀리지 않게 두께를 미리 잡아 둔다.
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  cardSelected: {
    borderColor: '#CBF1D3',
    backgroundColor: '#F2FFF4',
    shadowColor: '#936C49',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 36,
    height: 36,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: '#3C3C3C',
  },
});
