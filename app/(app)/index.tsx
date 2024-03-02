import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import Topbar from '@/components/common/Topbar';
import HomeNavButton from '@/components/home/HomeNavButton';
import FarmerSvg from '@/components/svg/FarmerSvg';
import PlotSvg from '@/components/svg/PlotSvg';

import { i18n } from '../_layout';
import SyncDataButton from '@/components/home/SyncDataButton';
import Connection from '@/components/connection/Connection';

export default function Home() {
  return (
    <SafeAreaView className="flex flex-col justify-between h-full">
      <Topbar title={i18n.t('home.title')} />
      <View className="flex flex-col">
        <HomeNavButton
          title={i18n.t('home.farmers')}
          icon={FarmerSvg}
          link="/(farmers)"
        />
        <HomeNavButton
          title={i18n.t('home.newPlot')}
          icon={PlotSvg}
          link="/(farmers)/new-plot"
        />
      </View>
      <SyncDataButton />
    </SafeAreaView>
  );
}
