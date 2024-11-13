import { View, Text, Pressable, ScrollView } from 'react-native';
import Card, { ItemProps } from '@/components/common/Card';
import i18n from '@/locales/i18n';
import { Farmer } from '@/types/farmer';

interface EditGuestFarmerProps {
  selectedFarmer: Farmer;
}

export default function EditGuestFarmer({
  selectedFarmer,
}: EditGuestFarmerProps) {
  return (
    <ScrollView className="h-full border-t bg-White border-t-LightGray">
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
            value: selectedFarmer?.location?.address?.country?.name ?? '',
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
              : selectedFarmer?.location?.address?.otherAddress
                ? [
                    {
                      type: 'view',
                      name: i18n.t('farmers.info.address.customAddress') + '*',
                      value:
                        selectedFarmer?.location?.address?.otherAddress ?? '',
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
            value: selectedFarmer?.farm?.areaUnit ?? '',
          },
          {
            type: 'view',
            name:
              i18n.t('farmers.info.farmInformation.totalFarmSize') +
              ` (${selectedFarmer?.farm?.areaUnit ?? '/'})`,
            value: selectedFarmer?.farm?.totalCultivatedArea?.toString() ?? '',
          },
          ...(selectedFarmer?.farm?.farmPlantInformationList
            ?.map((item, index) => [
              {
                type: 'view',
                name:
                  i18n.t('farmers.info.farmInformation.productType') +
                  ` ${index + 1}`,
                value: item?.productType?.name,
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
            value: selectedFarmer?.farm?.organic ? i18n.t('yes') : i18n.t('no'),
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
