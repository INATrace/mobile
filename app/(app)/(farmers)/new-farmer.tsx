import Card from '@/components/common/Card';
import i18n from '@/locales/i18n';
import { Farmer } from '@/types/farmer';
import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const genderItems = [
  {
    label: i18n.t('farmers.newFarmerCreation.gender.male'),
    value: i18n.t('farmers.newFarmerCreation.gender.male'),
  },
  {
    label: i18n.t('farmers.newFarmerCreation.gender.female'),
    value: i18n.t('farmers.newFarmerCreation.gender.female'),
  },
  {
    label: i18n.t('farmers.newFarmerCreation.gender.n/a'),
    value: i18n.t('farmers.newFarmerCreation.gender.n/a'),
  },
];

export default function NewFarmer() {
  const navigation = useNavigation();
  const [farmer, setFarmer] = useState<Farmer>({} as Farmer);

  const updateState = (path: Array<string | number>, value: any) => {
    setFarmer((currentFarmer) => {
      const updateNestedObject = (
        object: any,
        path: Array<string | number>,
        value: any
      ): any => {
        const updatedObject = { ...object };

        const key = path[0];

        if (path.length === 1) {
          updatedObject[key] = value;
        } else {
          updatedObject[key] = updateNestedObject(
            object[key] || {},
            path.slice(1),
            value
          );
        }

        return updatedObject;
      };

      return updateNestedObject(currentFarmer, path, value);
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center mr-3"
        >
          <ChevronLeft className="text-Orange" />
          <Text className="font-medium text-Orange text-[18px]">Back</Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={52}
      className="h-full border-t bg-White border-t-LightGray"
    >
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.basicInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'type',
            name: i18n.t('farmers.info.basicInformation.firstName'),
            placeholder: i18n.t('input.type'),
            value: farmer?.name ?? '',
            setValue: (value: string) => updateState(['name'], value),
          },
          {
            type: 'type',
            name: i18n.t('farmers.info.basicInformation.lastName'),
            placeholder: i18n.t('input.type'),
            value: farmer?.surname ?? '',
            setValue: (value: string) => updateState(['surname'], value),
          },
          {
            type: 'select',
            name: i18n.t('farmers.info.basicInformation.gender'),
            placeholder: i18n.t('input.select'),
            value: farmer?.gender ?? '',
            setValue: (value: string) => updateState(['gender'], value),
            selectItems: genderItems,
          },
          {
            type: 'type',
            name: i18n.t(
              'farmers.info.basicInformation.companyInternalFarmerId'
            ),
            placeholder: i18n.t('input.type'),
            value: farmer?.farmerCompanyInternalId ?? '',
            setValue: (value: string) =>
              updateState(['farmerCompanyInternalId'], value),
          },
        ]}
      />

      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.address.title')}
      </Text>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.contact.title')}
      </Text>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.productTypes.title')}
      </Text>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.farmInformation.title')}
      </Text>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.bankInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'type',
            name: i18n.t('farmers.info.bankInformation.bankAccountHolder'),
            placeholder: i18n.t('input.type'),
            value: farmer?.bank?.accountHolderName ?? '',
            setValue: (value: string) =>
              updateState(['bank', 'accountHolderName'], value),
          },
          {
            type: 'type',
            name: i18n.t('farmers.info.bankInformation.bankAccountNumber'),
            placeholder: i18n.t('input.type'),
            value: farmer?.bank?.accountNumber ?? '',
            setValue: (value: string) =>
              updateState(['bank', 'accountNumber'], value),
          },
          {
            type: 'type',
            name: i18n.t('farmers.info.bankInformation.bankName'),
            placeholder: i18n.t('input.type'),
            value: farmer?.bank?.bankName ?? '',
            setValue: (value: string) =>
              updateState(['bank', 'bankName'], value),
          },
        ]}
      />
    </KeyboardAwareScrollView>
  );
}
