import Card, { ItemProps } from '@/components/common/Card';
import SelectorMultiple from '@/components/common/SelectorMultiple';
import { ShadowButtonStyle } from '@/constants/Shadow';
import { AuthContext } from '@/context/AuthContext';
import i18n from '@/locales/i18n';
import { Country } from '@/types/country';
import { Farmer, ProductType, ProductTypeWithCompanyId } from '@/types/farmer';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useNavigation } from 'expo-router';
import { ChevronLeft, PlusCircle, X, XCircle } from 'lucide-react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const genderItems = [
  {
    label: i18n.t('farmers.newFarmerCreation.gender.male'),
    value: 'MALE',
  },
  {
    label: i18n.t('farmers.newFarmerCreation.gender.female'),
    value: 'FEMALE',
  },
  {
    label: i18n.t('farmers.newFarmerCreation.gender.n/a'),
    value: 'N/A',
  },
];

export default function NewFarmer() {
  const { countries, productTypes, selectedCompany, isConnected, makeRequest } =
    useContext(AuthContext) as {
      countries: Country[];
      productTypes: ProductTypeWithCompanyId[];
      selectedCompany: number;
      isConnected: boolean;
      makeRequest: any;
    };
  const [searchedCountries, setSearchedCountries] =
    useState<Country[]>(countries);
  const navigation = useNavigation();
  const [farmer, setFarmer] = useState<Farmer>({} as Farmer);
  const [productTypesSelect, setProductTypesSelect] = useState<ProductType[]>(
    []
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (
      selectedCompany &&
      typeof selectedCompany !== 'string' &&
      productTypes &&
      typeof productTypes !== 'string'
    ) {
      const filteredProductTypes = productTypes.find(
        (productType: ProductTypeWithCompanyId) =>
          productType.companyId === selectedCompany
      );

      if (filteredProductTypes) {
        setProductTypesSelect(filteredProductTypes.productTypes);
      }
    }
  }, [selectedCompany, productTypes]);

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

  const updateSearchCountries = (search: string) => {
    setSearchedCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
    );
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

  const saveFarmer = async () => {
    try {
      if (isConnected) {
        const response = await makeRequest({
          url: `/api/company/userCustomers/add/${selectedCompany}`,
          method: 'POST',
          body: farmer,
        });

        if (response?.data?.status === 'OK') {
          Alert.alert(
            i18n.t('farmers.newFarmerCreation.success'),
            i18n.t('farmers.newFarmerCreation.successMessage'),
            [
              {
                text: i18n.t('farmers.newFarmerCreation.ok'),
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } else {
          Alert.alert(
            i18n.t('farmers.newFarmerCreation.error'),
            i18n.t('farmers.newFarmerCreation.errorMessage')
          );
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        i18n.t('farmers.newFarmerCreation.error'),
        i18n.t('farmers.newFarmerCreation.errorMessage')
      );
    }
  };

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
      <Card
        items={[
          {
            type: 'select',
            name: i18n.t('farmers.info.address.country'),
            placeholder: i18n.t('input.select'),
            value: farmer?.location?.address?.country?.name ?? '',
            setValue: (value: string) =>
              updateState(
                ['location', 'address', 'country'],
                searchedCountries?.find((country) => country.name === value) ??
                  {}
              ),
            selectItems: searchedCountries?.map((country: Country) => ({
              label: country.name,
              value: country.name,
            })),
            selectWithSearch: true,
            updateSearch: updateSearchCountries,
          },
          ...((farmer?.location?.address?.country?.code === 'HN'
            ? [
                {
                  type: 'type',
                  name: i18n.t('farmers.info.address.hondurasFarm'),
                  placeholder: i18n.t('input.type'),
                  value: farmer?.location?.address?.hondurasFarm ?? '',
                  setValue: (value: string) =>
                    updateState(['location', 'address', 'hondurasFarm'], value),
                },
                {
                  type: 'type',
                  name: i18n.t('farmers.info.address.hondurasVillage'),
                  placeholder: i18n.t('input.type'),
                  value: farmer?.location?.address?.hondurasVillage ?? '',
                  setValue: (value: string) =>
                    updateState(
                      ['location', 'address', 'hondurasVillage'],
                      value
                    ),
                },
                {
                  type: 'type',
                  name: i18n.t('farmers.info.address.hondurasMunicipality'),
                  placeholder: i18n.t('input.type'),
                  value: farmer?.location?.address?.hondurasMunicipality ?? '',
                  setValue: (value: string) =>
                    updateState(
                      ['location', 'address', 'hondurasMunicipality'],
                      value
                    ),
                },
                {
                  type: 'type',
                  name: i18n.t('farmers.info.address.hondurasDepartment'),
                  placeholder: i18n.t('input.type'),
                  value: farmer?.location?.address?.hondurasDepartment ?? '',
                  setValue: (value: string) =>
                    updateState(
                      ['location', 'address', 'hondurasDepartment'],
                      value
                    ),
                },
              ]
            : farmer?.location?.address?.country?.code === 'RW'
              ? [
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.village'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.village ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'village'], value),
                  },
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.cell'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.cell ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'cell'], value),
                  },
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.sector'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.sector ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'sector'], value),
                  },
                ]
              : [
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.address'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.address ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'address'], value),
                  },
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.city'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.city ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'city'], value),
                  },
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.state'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.state ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'state'], value),
                  },
                  {
                    type: 'type',
                    name: i18n.t('farmers.info.address.zip'),
                    placeholder: i18n.t('input.type'),
                    value: farmer?.location?.address?.zip ?? '',
                    setValue: (value: string) =>
                      updateState(['location', 'address', 'zip'], value),
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
            type: 'type',
            name: i18n.t('farmers.info.contact.phoneNumber'),
            placeholder: i18n.t('input.type'),
            value: farmer?.phone ?? '',
            setValue: (value: string) => updateState(['phone'], value),
          },
          {
            type: 'type',
            name: i18n.t('farmers.info.contact.email'),
            placeholder: i18n.t('input.type'),
            value: farmer?.email ?? '',
            setValue: (value: string) => updateState(['email'], value),
          },
        ]}
      />
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.productTypes.title')}
      </Text>
      <View className="flex items-center w-full">
        <View className="flex flex-row flex-wrap justify-start w-full px-5 mt-2 mb-4">
          {farmer?.farm?.farmPlantInformationList?.map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between px-2 py-1 mt-2 mr-2 border rounded-md border-DarkGray"
            >
              <Text className="text-[16px] text-black mr-2">
                {item.productType.name.trim()}
              </Text>
              <Pressable
                className="flex items-center justify-center"
                onPress={() => {
                  setFarmer((currentFarmer: Farmer) => {
                    return {
                      ...currentFarmer,
                      farm: {
                        ...currentFarmer.farm,
                        farmPlantInformationList:
                          currentFarmer.farm?.farmPlantInformationList?.filter(
                            (f) => f.productType.id !== item.productType.id
                          ),
                      },
                    };
                  });
                }}
              >
                <XCircle className="text-black" size={16} />
              </Pressable>
            </View>
          ))}
        </View>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={['50%']}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              onPress={() => bottomSheetRef.current?.close()}
              disappearsOnIndex={-1}
            />
          )}
          enableDismissOnClose={true}
        >
          <BottomSheetScrollView className="rounded-t-md">
            <SelectorMultiple
              items={productTypesSelect.map((productType: ProductType) => ({
                label: productType.name,
                value: productType.id,
              }))}
              selected={
                farmer?.farm?.farmPlantInformationList?.length > 0
                  ? farmer?.farm?.farmPlantInformationList?.map(
                      (item) => item.productType.id
                    )
                  : []
              }
              setSelected={(selected: string | number) => {
                const productType = productTypesSelect.find(
                  (productType) => productType.id === selected
                );
                if (productType) {
                  if (
                    farmer?.farm?.farmPlantInformationList?.find(
                      (item) => item.productType.id === selected
                    )
                  ) {
                    setFarmer((currentFarmer: Farmer) => {
                      return {
                        ...currentFarmer,
                        farm: {
                          ...currentFarmer.farm,
                          farmPlantInformationList:
                            currentFarmer.farm?.farmPlantInformationList?.filter(
                              (item) => item.productType.id !== selected
                            ),
                        },
                      };
                    });
                  } else {
                    setFarmer((currentFarmer: Farmer) => {
                      return {
                        ...currentFarmer,
                        farm: {
                          ...currentFarmer.farm,
                          farmPlantInformationList: [
                            ...(currentFarmer.farm?.farmPlantInformationList ??
                              []),
                            {
                              productType,
                              plantCultivatedArea: 0,
                              numberOfPlants: 0,
                            },
                          ],
                        },
                      };
                    });
                  }
                }
              }}
            />
          </BottomSheetScrollView>
        </BottomSheetModal>
        <Pressable onPress={() => bottomSheetRef.current?.present()}>
          <PlusCircle className="text-black" />
        </Pressable>
      </View>
      <Text className="text-[18px] font-medium mt-5 mx-5">
        {i18n.t('farmers.info.farmInformation.title')}
      </Text>
      <Card
        items={[
          {
            type: 'type',
            name: i18n.t('farmers.info.farmInformation.areaUnit'),
            placeholder: i18n.t('input.type'),
            value: farmer?.farm?.areaUnit ?? '',
            setValue: (value: string) =>
              updateState(['farm', 'areaUnit'], value),
          },
          {
            type: 'type',
            name:
              i18n.t('farmers.info.farmInformation.totalFarmSize') +
              ` (${farmer?.farm?.areaUnit ?? '/'})`,
            placeholder: i18n.t('input.type'),
            value: farmer?.farm?.totalCultivatedArea?.toString() ?? '',
            setValue: (value: string) =>
              updateState(['farm', 'totalCultivatedArea'], value),
            isNumeric: true,
          },
          ...(farmer?.farm?.farmPlantInformationList
            ?.map((item, index) => [
              {
                type: 'view',
                name:
                  i18n.t('farmers.info.farmInformation.productType') +
                  ` ${index + 1}`,
                value: item.productType.name,
              } as ItemProps,
              {
                type: 'type',
                name:
                  i18n.t('farmers.info.farmInformation.area') +
                  ` (${farmer?.farm?.areaUnit ?? '/'})`,
                value: item?.plantCultivatedArea?.toString(),
                placeholder: i18n.t('input.type'),
                setValue: (value: string) => {
                  setFarmer((currentFarmer: Farmer) => {
                    return {
                      ...currentFarmer,
                      farm: {
                        ...currentFarmer.farm,
                        farmPlantInformationList:
                          currentFarmer.farm?.farmPlantInformationList?.map(
                            (f, i) => {
                              if (i === index) {
                                return {
                                  ...f,
                                  plantCultivatedArea: parseFloat(value) || 0,
                                };
                              }
                              return f;
                            }
                          ),
                      },
                    };
                  });
                },
                isNumeric: true,
              } as ItemProps,
              {
                type: 'type',
                name: i18n.t('farmers.info.farmInformation.plants'),
                value: item?.numberOfPlants?.toString(),
                placeholder: i18n.t('input.type'),
                setValue: (value: string) => {
                  setFarmer((currentFarmer: Farmer) => {
                    return {
                      ...currentFarmer,
                      farm: {
                        ...currentFarmer.farm,
                        farmPlantInformationList:
                          currentFarmer.farm?.farmPlantInformationList?.map(
                            (f, i) => {
                              if (i === index) {
                                return {
                                  ...f,
                                  numberOfPlants: parseFloat(value) || 0,
                                };
                              }
                              return f;
                            }
                          ),
                      },
                    };
                  });
                },
                isNumeric: true,
              } as ItemProps,
            ])
            .flat() || []),
          {
            type: 'checkbox',
            name: i18n.t('farmers.info.farmInformation.organicFarm'),
            value: farmer?.farm?.organic ? i18n.t('yes') : i18n.t('no'),
            setValue: (value: string) =>
              updateState(
                ['farm', 'organic'],
                value === i18n.t('yes') ? true : false
              ),
          },
          {
            type: 'date',
            name: i18n.t(
              'farmers.info.farmInformation.startedTransitionToOrganic'
            ),
            placeholder: i18n.t('input.select'),
            value: farmer?.farm?.startTransitionToOrganic ?? '',
            setValue: (value: string) =>
              updateState(['farm', 'startTransitionToOrganic'], value),
          },
        ]}
      />
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

      <Pressable
        onPress={saveFarmer}
        className="flex flex-row items-center justify-center h-12 mx-5 mt-5 mb-10 rounded-md bg-Orange"
        style={ShadowButtonStyle}
      >
        <Text className="text-White text-[18px] font-medium">
          {i18n.t('farmers.newFarmerCreation.saveFarmer')}
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}
