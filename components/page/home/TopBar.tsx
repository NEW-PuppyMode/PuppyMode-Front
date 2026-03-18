import CalendarIcon from '@/assets/icons/home/ic_calendar.svg';
import SettingIcon from '@/assets/icons/home/ic_cogwheel.svg';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface Props {
  level: number;
  displayName: string;
  percent: number;
}

export function TopBar({ level, displayName, percent }: Props) {
  return (
    <ThemedView className='relative flex-row justify-between items-center gap-12 px-4 pt-20 bg-transparent'>
      <ThemedView className='flex-1 px-4 py-3 rounded-2xl bg-cream-200'>
        <ThemedView className='flex-row items-center mb-2 bg-transparent'>
          <ThemedView className='bg-green-500 px-2 py-1 rounded-full'>
            <ThemedText className='text-white text-xs font-semibold'>
              Level {level}
            </ThemedText>
          </ThemedView>
          <ThemedText className='ml-2 text-sm text-gray-600'>
            {displayName}
          </ThemedText>
          <ThemedText className='ml-auto text-green-500 text-xs font-bold'>
            {percent}%
          </ThemedText>
        </ThemedView>
        <ThemedView className='bg-green-100 h-2 rounded-full'>
          <ThemedView
            className='bg-green-500 h-2 rounded-full'
            style={{ width: `${percent}%` }}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView className='fixed top-[-10px] right-0 flex-row ml-4 gap-1 bg-transparent'>
        <TouchableOpacity
          className='w-10 h-10 justify-center items-center bg-white rounded-full shadow-sm'
          onPress={() => router.replace('/calendar')}
        >
          <CalendarIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          className='w-10 h-10 justify-center items-center bg-white rounded-full shadow-sm'
          onPress={() => {
            // crashlytics().setAttribute('route_intent', '/setting');
            // crashlytics().log('navigate: settings (Home/TopBar)');
            router.replace('/setting');
          }}
        >
          <SettingIcon width={20} height={20} color='#10B981' />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
