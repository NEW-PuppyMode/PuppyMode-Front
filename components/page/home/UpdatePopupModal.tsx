import DefaultModal from '@/components/common/DefaultModal';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onLater: () => void;
  onUpdate: () => void;
}

export function UpdatePopupModal({ visible, onLater, onUpdate }: Props) {
  return (
    <DefaultModal visible={visible} setVisible={onLater}>
      <View className='justify-between p-[15px] pt-[35px] w-[336px]  bg-white rounded-[10px]'>
        {/* ===== 안내 텍스트 ===== */}
        <View className='items-center gap-[12px] px-[12px] py-[10px] w-full'>
          <Text className='text-center font-semibold text-[18px] text-grayscale-700'>
            <Text className='text-green-500'>멍멍멍멍멍</Text>의 환경을
            개선했어요!
          </Text>
          <Text className='text-center font-normal text-[14px] text-grayscale-600'>
            앱 안정성을 높이고 일부 오류를 수정했어요
          </Text>
        </View>

        {/* ===== 버튼 ===== */}
        <View className='flex-row justify-between'>
          <TouchableOpacity
            className='w-[148px] h-[48px] rounded-[5px] border border-green-500 items-center justify-center'
            onPress={onLater}
          >
            <Text className='font-medium text-[12px] text-green-500'>
              나중에
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='w-[148px] h-[48px] rounded-[5px] bg-green-500 items-center justify-center'
            onPress={onUpdate}
            activeOpacity={0.75}
          >
            <Text className='font-medium text-[12px] text-green-050'>
              업데이트 하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </DefaultModal>
  );
}
