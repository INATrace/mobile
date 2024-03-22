import Card from '@/components/common/Card';
import { ShadowButtonStyle } from '@/constants/Shadow';
import { AuthContext } from '@/context/AuthContext';
import i18n from '@/locales/i18n';
import { ProductTypeWithCompanyId } from '@/types/farmer';
import { useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type PlotInto = {
  plotName: string;
  crop: string;
  numberOfPlants: number;
  size: string;
  geoId: string;
  certification: string;
  organicStartOfTransition: string;
};

type PlotInfoErrors = {
  plotName: boolean;
  crop: boolean;
  numberOfPlants: boolean;
  certification: boolean;
  organicStartOfTransition: boolean;
};

const certificationItems = [
  {
    label: 'EU_ORGANIC',
    value: 'EU_ORGANIC',
  },
  {
    label: 'RAINFOREST_ALLIANCE',
    value: 'RAINFOREST_ALLIANCE',
  },
  {
    label: 'CARBON_NEUTRAL',
    value: 'CARBON_NEUTRAL',
  },
  {
    label: 'FAIRTRADE',
    value: 'FAIRTRADE',
  },
];

export default function AddPlot() {
  const [plotInfo, setPlotInfo] = useState<PlotInto>({} as PlotInto);
  const [plotFieldErrors, setPlotFieldErrors] = useState<PlotInfoErrors>(
    {} as PlotInfoErrors
  );
  const [crops, setCrops] = useState<Array<{ label: string; value: string }>>(
    []
  );
  const { newPlot, productTypes, selectedCompany } = useContext(AuthContext);

  const navigation = useNavigation();

  const updateState = (path: Array<string | number>, value: any) => {
    setPlotInfo((currentInfo) => {
      const updateNestedObject = (
        object: any,
        path: Array<string | number>,
        value: any
      ): any => {
        const updatedObject = { ...object };

        const key = path[0];

        validateFields();

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

      return updateNestedObject(currentInfo, path, value);
    });
  };

  useEffect(() => {
    if (
      productTypes &&
      typeof productTypes !== 'string' &&
      selectedCompany &&
      typeof selectedCompany !== 'string'
    ) {
      const products = productTypes?.find(
        (product: ProductTypeWithCompanyId) => {
          return product.companyId === selectedCompany;
        }
      );

      if (products) {
        setCrops(
          products.productTypes.map((product) => ({
            label: product.name,
            value: product.code,
          }))
        );
      }
    }
  }, [productTypes, selectedCompany]);

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

  const validateFields = () => {
    const errors: PlotInfoErrors = {
      plotName: !plotInfo.plotName,
      crop: !plotInfo.crop,
      numberOfPlants: !plotInfo.numberOfPlants,
      certification: !plotInfo.certification,
      organicStartOfTransition: !plotInfo.organicStartOfTransition,
    };

    setPlotFieldErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const savePlot = async () => {
    if (validateFields()) {
      // save plot
      console.log('save plot');
    } else {
      console.log('error');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        justifyContent: 'space-between',
        height: '100%',
      }}
      className="flex border-t bg-White border-t-LightGray"
    >
      <View>
        <Text className="text-[18px] font-medium mt-5 mx-5">
          {i18n.t('plots.addPlot.plotInformation')}
        </Text>
        <Card
          items={[
            {
              type: 'type',
              name: i18n.t('plots.addPlot.plotName'),
              placeholder: i18n.t('input.type'),
              value: plotInfo?.plotName ?? '',
              setValue: (value: string) => updateState(['plotName'], value),
              error: plotFieldErrors?.plotName,
            },
            {
              type: 'select',
              name: i18n.t('plots.addPlot.crop'),
              placeholder: i18n.t('input.select'),
              value: plotInfo?.crop ?? '',
              setValue: (value: string) => updateState(['crop'], value),
              selectItems: crops,
              error: plotFieldErrors?.crop,
            },
            {
              type: 'type',
              name: i18n.t('plots.addPlot.numberOfPlants'),
              placeholder: i18n.t('input.type'),
              value: plotInfo?.numberOfPlants?.toString() ?? '',
              isNumeric: true,
              setValue: (value: string) =>
                updateState(['numberOfPlants'], value),
              error: plotFieldErrors?.numberOfPlants,
            },
            {
              type: 'view',
              name: i18n.t('plots.addPlot.size'),
              value: newPlot?.size ?? '',
            },
            {
              type: 'view',
              name: i18n.t('plots.addPlot.geoId'),
              value: newPlot?.geoId ?? '',
            },
            {
              type: 'select',
              name: i18n.t('plots.addPlot.certification'),
              placeholder: i18n.t('input.select'),
              value: plotInfo?.certification ?? '',
              setValue: (value: string) =>
                updateState(['certification'], value),
              selectItems: certificationItems,
              snapPoints: '50%',
              error: plotFieldErrors?.certification,
            },
            {
              type: 'date',
              name: i18n.t('plots.addPlot.organicStartOfTransition'),
              placeholder: i18n.t('input.select'),
              value: plotInfo?.organicStartOfTransition ?? '',
              setValue: (value: string) =>
                updateState(['organicStartOfTransition'], value),
              error: plotFieldErrors?.organicStartOfTransition,
            },
          ]}
        />
      </View>
      <Pressable
        className="flex flex-row items-center justify-center h-12 mx-5 mt-5 mb-10 rounded-md bg-Orange"
        style={ShadowButtonStyle}
        onPress={savePlot}
      >
        <Text className="text-White text-[18px] font-medium">
          {i18n.t('plots.addPlot.savePlot')}
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}
