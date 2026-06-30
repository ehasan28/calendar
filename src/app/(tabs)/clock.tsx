import { View } from 'react-native';

import { ClockView } from '@/components/clock/clock-view';

export default function ClockScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ClockView />
    </View>
  );
}
