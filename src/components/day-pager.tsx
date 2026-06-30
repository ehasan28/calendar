import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

/**
 * Horizontal day pager with unlimited swiping. Swipe left → next day, right →
 * previous day. Coordinates with vertical scroll via activeOffsetX/failOffsetY,
 * so the surrounding ScrollView still scrolls. `onChange(delta)` gets +1 (next)
 * or -1 (previous); the parent advances its focused date.
 */
export function DayPager({ onChange, children }: { onChange: (delta: number) => void; children: React.ReactNode }) {
  const W = Dimensions.get('window').width;
  const tx = useSharedValue(0);

  // Slide current content out, swap the date, then bring new content in.
  const settle = (delta: number) => {
    'worklet';
    const exit = delta > 0 ? -W : W; // next exits left, prev exits right
    tx.value = withTiming(exit, { duration: 150 }, (finished) => {
      if (!finished) return;
      runOnJS(onChange)(delta);
      tx.value = -exit; // enter from the opposite edge
      tx.value = withTiming(0, { duration: 190 });
    });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-14, 14])
    .onUpdate((e) => {
      tx.value = e.translationX;
    })
    .onEnd((e) => {
      const threshold = W * 0.22;
      if (e.translationX <= -threshold || e.velocityX < -650) settle(1);
      else if (e.translationX >= threshold || e.velocityX > 650) settle(-1);
      else tx.value = withTiming(0, { duration: 150 });
    });

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.fill, style]}>{children}</Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({ fill: { width: '100%' } });
