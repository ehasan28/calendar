import { View } from 'react-native';

import { ClockView } from '@/components/clock/clock-view';

export default function ClockFullScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ClockView fullscreen />
    </View>
  );
}
