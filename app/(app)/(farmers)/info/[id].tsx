import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import i18n from '@/locales/i18n';
import Card, { ItemProps } from '@/components/common/Card';
import { ChevronLeft } from 'lucide-react-native';
import { Farmer } from '@/types/farmer';

export default function FarmersInfo() {
  const { selectedFarmer } = useContext(AuthContext) as {
    selectedFarmer: Farmer;
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: `${selectedFarmer?.name} ${selectedFarmer?.surname}`,
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
  }, [selectedFarmer]);

  const navigateToPlots = () => {
    router.push(`view/${selectedFarmer?.id?.toString()}` as any);
  };

  return (
    <ScrollView className="h-full border-t bg-White border-t-LightGray">
      <View className="flex flex-col items-center justify-center pt-5 mx-5">
        <QRCode value={selectedFarmer?.id?.toString()} />
        <Text className="mt-3 mb-5">{selectedFarmer?.id}</Text>
        <Pressable
          className="flex flex-row items-center justify-center w-full px-5 py-3 rounded-md bg-Orange"
          onPress={navigateToPlots}
        >
          <Text className="text-[16px] text-White font-semibold">
            {i18n.t('farmers.info.viewAllPlots')}
          </Text>
        </Pressable>
      </View>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.basicInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.firstName'),
            value: selectedFarmer?.name ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.lastName'),
            value: selectedFarmer?.surname ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.gender'),
            value: selectedFarmer?.gender ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.basicInformation.userId'),
            value: selectedFarmer?.id?.toString() ?? '',
          },
          {
            type: 'view',
            name: i18n.t(
              'farmers.info.basicInformation.companyInternalFarmerId'
            ),
            value: selectedFarmer?.farmerCompanyInternalId ?? '',
          },
        ]}
      />
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.address.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.address.country'),
            value: selectedFarmer?.location.address.country.name ?? '',
          },
          ...((selectedFarmer?.location?.address?.country?.code === 'HN'
            ? [
                {
                  type: 'view',
                  name: i18n.t('farmers.info.address.hondurasFarm') + '*',
                  value: selectedFarmer?.location?.address?.hondurasFarm ?? '',
                },
                {
                  type: 'view',
                  name: i18n.t('farmers.info.address.hondurasVillage') + '*',
                  value:
                    selectedFarmer?.location?.address?.hondurasVillage ?? '',
                },
                {
                  type: 'view',
                  name:
                    i18n.t('farmers.info.address.hondurasMunicipality') + '*',
                  value:
                    selectedFarmer?.location?.address?.hondurasMunicipality ??
                    '',
                },
                {
                  type: 'view',
                  name: i18n.t('farmers.info.address.hondurasDepartment') + '*',
                  value:
                    selectedFarmer?.location?.address?.hondurasDepartment ?? '',
                },
              ]
            : selectedFarmer?.location?.address?.country?.code === 'RW'
              ? [
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.village') + '*',
                    value: selectedFarmer?.location?.address?.village ?? '',
                  },
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.cell') + '*',
                    value: selectedFarmer?.location?.address?.cell ?? '',
                  },
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.sector') + '*',
                    value: selectedFarmer?.location?.address?.sector ?? '',
                  },
                ]
              : [
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.address') + '*',
                    value: selectedFarmer?.location?.address?.address ?? '',
                  },
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.city') + '*',
                    value: selectedFarmer?.location?.address?.city ?? '',
                  },
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.state') + '*',
                    value: selectedFarmer?.location?.address?.state ?? '',
                  },
                  {
                    type: 'view',
                    name: i18n.t('farmers.info.address.zip') + '*',
                    value: selectedFarmer?.location?.address?.zip ?? '',
                  },
                ]) as ItemProps[]),
        ]}
      />
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.contact.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.contact.phoneNumber'),
            value: selectedFarmer?.phone ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.contact.email'),
            value: selectedFarmer?.email ?? '',
          },
        ]}
      />
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.farmInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.farmInformation.areaUnit'),
            value: selectedFarmer?.farm.areaUnit ?? '',
          },
          {
            type: 'view',
            name:
              i18n.t('farmers.info.farmInformation.totalFarmSize') +
              ` (${selectedFarmer?.farm.areaUnit ?? '/'})`,
            value: selectedFarmer?.farm?.totalCultivatedArea?.toString() ?? '',
          },
          ...(selectedFarmer?.farm.farmPlantInformationList
            ?.map((item, index) => [
              {
                type: 'view',
                name:
                  i18n.t('farmers.info.farmInformation.productType') +
                  ` ${index + 1}`,
                value: item.productType.name,
              } as ItemProps,
              {
                type: 'view',
                name:
                  i18n.t('farmers.info.farmInformation.area') +
                  ` (${selectedFarmer?.farm?.areaUnit ?? '/'})`,
                value: item?.plantCultivatedArea?.toString(),
              } as ItemProps,
              {
                type: 'view',
                name: i18n.t('farmers.info.farmInformation.plants'),
                value: item?.numberOfPlants?.toString(),
              } as ItemProps,
            ])
            .flat() || []),
          {
            type: 'view',
            name: i18n.t('farmers.info.farmInformation.organicFarm'),
            value: selectedFarmer?.farm.organic ? i18n.t('yes') : i18n.t('no'),
          },
          {
            type: 'view',
            name: i18n.t(
              'farmers.info.farmInformation.startedTransitionToOrganic'
            ),
            value: selectedFarmer?.farm?.startTransitionToOrganic
              ? Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }).format(
                  new Date(selectedFarmer?.farm?.startTransitionToOrganic ?? '')
                )
              : '',
          },
        ]}
      />
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.bankInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'view',
            name: i18n.t('farmers.info.bankInformation.bankAccountHolder'),
            value: selectedFarmer?.bank?.accountHolderName ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.bankInformation.bankAccountNumber'),
            value: selectedFarmer?.bank?.accountNumber ?? '',
          },
          {
            type: 'view',
            name: i18n.t('farmers.info.bankInformation.bankName'),
            value: selectedFarmer?.bank?.bankName ?? '',
          },
        ]}
      />
    </ScrollView>
  );
}
