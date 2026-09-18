import DefaultModal from '@/components/common/DefaultModal';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RenameModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  /** 모달 제목. e.g. '이름 수정' */
  title: string;
  /** 제목 아래 안내 문구. e.g. '친구들에게 보여질 이름이에요' */
  description: string;
  /** 모달을 열 때 입력창에 채워둘 현재 이름 */
  initialValue?: string;
  placeholder?: string;
  maxLength?: number;
  onSave: (value: string) => void;
  isPending?: boolean;
}

/**
 * 이름 수정 모달.
 *
 * 설정 화면의 '이름 수정'과 '강아지 이름 수정'은 문구만 다르고 구조가 같아
 * 하나의 component로 처리한다.
 *
 * 공용 Inputs/TextInput 대신 RN TextInput을 직접 쓴다. 공용 쪽은 값 유무에 따라
 * 배경색이 바뀌는 온보딩용 스타일이라 이 모달의 디자인과 맞지 않는다.
 */
const RenameModal = ({
  visible,
  setVisible,
  title,
  description,
  initialValue = '',
  placeholder = '이름을 입력해주세요.',
  maxLength = 10,
  onSave,
  isPending = false,
}: RenameModalProps) => {
  const [value, setValue] = useState(initialValue);

  // 모달을 열 때마다 현재 이름으로 되돌린다. 취소로 닫은 뒤 다시 열었을 때
  // 직전에 입력하다 만 값이 남아 있지 않게 하려는 것이다.
  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const canSave = !!value.trim() && !isPending;

  return (
    <DefaultModal visible={visible} setVisible={setVisible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className='items-center px-[15px] pt-[25px] pb-[15px] w-[336px] bg-white rounded-[10px]'>
          <Text className='font-semibold text-[18px] leading-[22px] tracking-[-0.54px] text-grayscale-700'>
            {title}
          </Text>
          <Text className='mt-[8px] text-center font-normal text-[14px] leading-[22px] text-grayscale-600'>
            {description}
          </Text>

          <View className='py-[16px] w-full'>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor='#BABABA'
              maxLength={maxLength}
              returnKeyType='done'
              onSubmitEditing={() => {
                if (canSave) onSave(value.trim());
              }}
              className='px-[20px] h-[44px] font-medium text-[13px] text-grayscale-950 bg-green-050 border border-green-500 rounded-[20px]'
            />
          </View>

          <View className='flex-row gap-[10px] h-[48px]'>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className='w-[148px] h-[48px] rounded-[5px] bg-grayscale-50 items-center justify-center'
              activeOpacity={0.75}
            >
              <Text className='font-medium text-[12px] text-grayscale-500'>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSave(value.trim())}
              disabled={!canSave}
              className={`w-[148px] h-[48px] rounded-[5px] bg-green-500 items-center justify-center ${
                canSave ? '' : 'opacity-40'
              }`}
              activeOpacity={0.75}
            >
              <Text className='font-medium text-[12px] text-green-050'>
                저장
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </DefaultModal>
  );
};

export default RenameModal;
