import { Pressable, TextInput, View, Text } from 'react-native';
import { ArrowDownUp, Filter, Search } from 'lucide-react-native';
import i18n from '@/locales/i18n';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { MenuView } from '@react-native-menu/menu';

type SearchInputProps = {
  input: string;
  setInput: (input: string) => void;
  showSort: boolean;
  setShowSort: (showSort: boolean) => void;
  selectedSort: string;
  setSelectedSort: (selectedSort: string) => void;
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (selectedFilter: string) => void;
  sortItems: { label: string; value: string }[];
  filterItems: { label: string; value: string }[];
};

export default function SearchInput(props: SearchInputProps) {
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
        onPress={() => props.setShowSort(!props.showSort)}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <ArrowDownUp className="text-LightGray" />
      </Pressable>
      {props.showSort && (
        <View className="absolute bg-White top-20">
          <Picker
            selectedValue={props.selectedSort}
            onValueChange={(itemValue: string) =>
              props.setSelectedSort(itemValue)
            }
            style={{ width: 300 }}
          >
            {props.sortItems.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              );
            })}
          </Picker>
        </View>
      )}
      <Pressable
        onPress={() => props.setShowFilter(!props.showFilter)}
        className="flex flex-row items-center justify-center w-12 h-12 mt-1 border rounded-md border-LightGray bg-White"
      >
        <Filter className="text-LightGray" />
      </Pressable>
      {props.showFilter && (
        <View className="absolute bg-White top-20 right-5">
          <Picker
            selectedValue={props.selectedFilter}
            onValueChange={(itemValue: string) =>
              props.setSelectedFilter(itemValue)
            }
            style={{ width: 300 }}
          >
            {props.filterItems.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              );
            })}
          </Picker>
        </View>
      )}
    </View>
  );
}
