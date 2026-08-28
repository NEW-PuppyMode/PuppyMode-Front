import DefaultModal from '@/components/common/DefaultModal';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  updateRequired: boolean;
  onLater: () => void;
  onUpdate: () => void;
}

export function UpdatePopupModal({ visible, updateRequired, onLater, onUpdate }: Props) {
  return (
    <DefaultModal visible={visible} setVisible={updateRequired ? () => {} : onLater}>
      <View className='justify-between p-[15px] pt-[35px] w-[336px]  bg-white rounded-[10px]'>
        {/* ===== 안내 텍스트 ===== */}
        {/* NativeWind v2의 gap-*은 "부모에 음수 마진 + 자식에 양수 마진"으로 흉내 내는
            방식이라, 부모 박스가 밀리고 자식 마진 때문에 items-center 정렬도 틀어진다.
            RN 0.79의 네이티브 gap을 쓴다. */}
        <View
          className='items-center px-[12px] py-[10px] w-full'
          style={{ gap: 12 }}
        >
          <Text className='text-center font-semibold text-[18px] text-grayscale-700'>
            <Text className='text-green-500'>멍멍멍멍멍</Text>의 환경을
            개선했어요!
          </Text>
          <Text className='text-center font-normal text-[14px] text-grayscale-600'>
            {updateRequired
              ? '계속 이용하려면 업데이트가 필요해요'
              : '앱 안정성을 높이고 일부 오류를 수정했어요'}
          </Text>
        </View>

        {/* ===== 버튼 ===== */}
        <View className='flex-row justify-between'>
          {!updateRequired && (
            <TouchableOpacity
              className='w-[148px] h-[48px] rounded-[5px] border border-green-500 items-center justify-center'
              onPress={onLater}
            >
              <Text className='font-medium text-[12px] text-green-500'>
                나중에
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`h-[48px] rounded-[5px] bg-green-500 items-center justify-center ${updateRequired ? 'w-full' : 'w-[148px]'}`}
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
