import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const NavHeader = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        width: '100%',
        height: 60,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          className='w-[8px] h-[16px]'
          source={require('@/assets/images/chevron_left.png')}
          style={{ margin: 10 }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 28,
          color: '#282828',
        }}
      >
        {title}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default NavHeader;
