import { ScrollView, View } from 'react-native';
import ViewSwitcher, { ViewSwitcherProps } from './ViewSwitcher';

export default function ListView({ viewType, setViewType }: ViewSwitcherProps) {
  return (
    <ScrollView>
      <ViewSwitcher viewType={viewType} setViewType={setViewType} padding />
    </ScrollView>
  );
}
