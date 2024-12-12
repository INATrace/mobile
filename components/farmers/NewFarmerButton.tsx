import { ShadowButtonStyle } from '@/constants/Shadow';
import i18n from '@/locales/i18n';
import cn from '@/utils/cn';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View, Text } from 'react-native';

export default function NewFarmerButton() {
  return (
    <Link href="/(app)/(farmers)/new-farmer" className="mb-5" asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            className={cn(
              pressed ? 'bg-Orange' : 'bg-Orange',
              'flex flex-row m-5 p-3 items-center justify-center rounded-md'
            )}
          >
            <Plus className="text-White" />
            <View className="w-2" />
            <Text className="text-[16px] text-White font-semibold">
              {i18n.t('farmers.newFarmer')}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
}

export const ButtonWrapper = ({ children }: any) => {
  return (
    <View className="absolute bottom-0 w-full" style={ShadowButtonStyle}>
      {children}
    </View>
  );
};