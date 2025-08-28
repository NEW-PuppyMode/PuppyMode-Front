// components/StatCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
interface StatCardProps {
  title: string;
  secondTitle?: string;
  thirdTitle?: string;
  value: string | number;
  subValue?: string; // 필요할 때만
  bigSquare?: boolean;
  rowSquare?: boolean;
}

const styles = StyleSheet.create({
  card: {
    // iOS shadow
    shadowColor: '#EAEAEA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,

    // Android shadow
    elevation: 5,
  },
});

export function StatCard({
  title,
  value,
  subValue,
  secondTitle,
  thirdTitle,
  bigSquare,
  rowSquare,
}: StatCardProps) {
  return (
    <View
      style={styles.card}
      className={`flex-1 pt-5 pl-3 pr-4 bg-white rounded-2xl ${rowSquare ? 'flex-row justify-between' : 'justify-between flex-col'}`}
    >
      {/* 제목 */}
      <View>
        <Text className='text-base font-bold text-gray-900'>{title}</Text>
        {secondTitle && (
          <Text className='text-base font-bold text-gray-900'>
            {secondTitle}
          </Text>
        )}
        {thirdTitle && (
          <Text className='text-base font-bold text-gray-900'>
            {thirdTitle}
          </Text>
        )}
      </View>

      {/* 값 */}
      <View className={`mb-5 ${rowSquare ? 'justify-end' : ''}`}>
        <View className='items-end'>
          <View
            className={`flex-row justify-center rounded-[15px] ${bigSquare ? 'h-[54px] w-[100px] py-[6px] bg-green-500' : 'w-[86px] py-[7px] bg-green-100 h-[44px]'}`}
          >
            <Text
              className={`flex-row self-center font-bold ${bigSquare ? 'text-white text-3xl' : 'text-green-500 text-2xl '}`}
            >
              {value}
            </Text>
            {subValue && (
              <Text className='self-end text-sm text-green-warm-300'>
                {subValue}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
