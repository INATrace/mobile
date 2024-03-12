import { Pressable, TextInput, View, Text } from 'react-native';
import { ArrowDownUp, Filter, Search } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import Colors from '@/constants/Colors';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type SearchInputProps = {
  input: string;
  setInput: (input: string) => void;
  selectedSort: string;
  setSelectedSort: (selectedSort: string) => void;
  selectedFilter: string;
  setSelectedFilter: (selectedFilter: string) => void;
  sortItems: { label: string; value: string }[];
  filterItems: { label: string; value: string }[];
};

export default function SearchInput(props: SearchInputProps) {
  const bottomSheetSortModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetFilterModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentSortModalPress = useCallback(() => {
    bottomSheetSortModalRef.current?.present();
  }, []);

  const handlePresentFilterModalPress = useCallback(() => {
    bottomSheetFilterModalRef.current?.present();
  }, []);

  return (
    <View className="flex flex-row items-center justify-between px-5">
      <View className="relative flex flex-row items-center justify-between h-12 mt-1 border rounded-md border-LightGray bg-White w-[70%]">
        <Search className="absolute text-LightGray left-4" />
        <TextInput
          placeholder={i18n.t('farmers.search')}
          value={props.input}
          onChangeText={props.setInput}
          placeholderTextColor={Colors.darkGray}
          className="text-[16px] h-12 px-2 pl-12 rounded-md w-full"
        />
      </View>
      <Pressable
        onPress={handlePresentSortModalPress}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <ArrowDownUp className="text-LightGray" />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetSortModalRef}
        index={1}
        snapPoints={snapPoints}
      >
        <BottomSheetView className="rounded-t-md">
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>

      <Pressable
        onPress={handlePresentFilterModalPress}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <Filter className="text-LightGray" />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetFilterModalRef}
        index={1}
        snapPoints={snapPoints}
      >
        <BottomSheetView className="rounded-t-md">
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
