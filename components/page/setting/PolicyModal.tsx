import DefaultModal from '@/components/common/DefaultModal';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface PolicyModalProps {
  title: string;
  content?: string;
  visible: boolean;
  setPolicyModalVisible: (visible: boolean) => void;
}

const PolicyModal = ({
  title,
  content,
  visible,
  setPolicyModalVisible,
}: PolicyModalProps) => {
  return (
    <DefaultModal visible={visible} setVisible={setPolicyModalVisible}>
      <View className='w-[336px] h-[312px] bg-white rounded-[7px]'>
        <Text className='mt-[20px] mb-[19px] text-[#555] text-center font-semibold text-[18px]'>
          {title}
        </Text>
        <View className='mx-[1.5px] w-full h-[2px] bg-[#F1F1F1]'></View>
        <View className='flex-1 items-center mt-[19px]'>
          <View className='py-[10px] pl-[15.5px] pr-[14.5px] w-[290px] h-[146px] bg-[#FBFBFB] rounded-[10px]'>
            <ScrollView
              className='flex-1'
              showsVerticalScrollIndicator
              indicatorStyle='black' // iOS에서 색상
              persistentScrollbar
            >
              <Text className='text-[#777] text-[11px] font-normal'>
                {content}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View className='px-[20px] pb-[20px]'>
          <TouchableOpacity
            className='flex items-center justify-center h-[48px] bg-[#0FD380] rounded-[5px]'
            onPress={() => setPolicyModalVisible(false)}
          >
            <Text className='text-[#F2FFF4] text-[12px] font-medium'>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DefaultModal>
  );
};

export default PolicyModal;
