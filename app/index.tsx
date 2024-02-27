import { SafeAreaView } from 'react-native-safe-area-context'

import Topbar from '@/components/common/Topbar'
import HomeNavButton from '@/components/home/HomeNavButton'
import FarmerSvg from '@/components/svg/FarmerSvg'
import PlotSvg from '@/components/svg/PlotSvg'

import { i18n } from './_layout'

export default function Home() {
  return (
    <SafeAreaView className="">
      <Topbar title={i18n.t('home.title')} />
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
    </SafeAreaView>
  )
}
