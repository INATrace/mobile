import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, View, Text } from 'react-native';

import Topbar from '@/components/common/Topbar';
import HomeNavButton from '@/components/home/HomeNavButton';
import FarmerSvg from '@/components/svg/FarmerSvg';
import PlotSvg from '@/components/svg/PlotSvg';

import i18n from '@/locales/i18n';
import SyncDataButton from '@/components/home/SyncDataButton';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Modal from 'react-native-modalbox';
import LanguageSwitcher from '@/components/settings/LanguageSwitcher';
import { X } from 'lucide-react-native';

export default function Home() {
  const { askLanguage, setAskLanguage } = useContext(AuthContext);
  const [_, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const unsubscribe = i18n.onChange(() => {
      setLocale(i18n.locale);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('askLanguage', askLanguage);
    if (askLanguage === 'none') {
      console.log('askLanguage', askLanguage);
    }
  }, [askLanguage]);

  return (
    <SafeAreaView
      className="flex flex-col justify-between h-full bg-Background"
      edges={{ top: 'maximum' }}
    >
      {askLanguage === 'none' ||
        (askLanguage === false && (
          <Modal
            isOpen={askLanguage === false || askLanguage === 'none'}
            onClosed={() => setAskLanguage(true)}
            position={'center'}
            backdropPressToClose={true}
            style={{
              height: 200,
              width: '90%',
              marginRight: 250,
              borderRadius: 8,
              padding: 20,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="text-[18px] font-medium">
                  {i18n.t('plots.mapTitle')}
                </Text>
                <Pressable onPress={() => setAskLanguage(true)} className="">
                  <X size={20} className="text-black" />
                </Pressable>
              </View>

              <LanguageSwitcher />
            </View>
          </Modal>
        ))}
      <Topbar title={i18n.t('home.title')} />
      <View className="flex flex-col">
        <HomeNavButton
          title={i18n.t('home.farmers')}
          icon={FarmerSvg}
          link="/(farmers)/farmers"
        />
        <HomeNavButton
          title={i18n.t('home.newPlot')}
          icon={PlotSvg}
          link="/(farmers)/newplot"
        />
      </View>
      <View className="pb-5 border-t bg-White border-t-LightGray">
        <SyncDataButton />
      </View>
    </SafeAreaView>
  );
}
