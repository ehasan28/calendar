import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Rect, Stop } from 'react-native-svg';

import { minutesNow, phaseOf, skyGradient } from '@/lib/sun';
import type { ClockTheme } from '@/store/useStore';
import { CelestialArc } from '@/themes/celestial-arc';

/** Simple full-screen morphing gradient that tracks the time of day. */
function GradientSky({ now }: { now: Date }) {
  const [top, bottom] = skyGradient(phaseOf(minutesNow(now)));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="0.3" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#g)" />
      </Svg>
    </View>
  );
}

/** Soft drifting aurora ribbons over a night-leaning gradient. */
function Aurora({ now }: { now: Date }) {
  const [top, bottom] = skyGradient(phaseOf(minutesNow(now)));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#ag)" />
        <Ellipse cx="35" cy="40" rx="60" ry="12" fill="#3FE0B0" opacity={0.18} />
        <Ellipse cx="65" cy="55" rx="55" ry="10" fill="#6A8CFF" opacity={0.16} />
        <Ellipse cx="50" cy="68" rx="70" ry="9" fill="#B36AFF" opacity={0.12} />
        {[15, 30, 50, 70, 85].map((cx, i) => (
          <Circle key={i} cx={cx} cy={18 + (i % 2) * 6} r={0.4} fill="#fff" opacity={0.7} />
        ))}
      </Svg>
    </View>
  );
}

/** Picks the active background theme. `celestial` needs sunrise/sunset minutes. */
export function ThemeBackground({
  theme,
  now,
  sunrise,
  sunset,
}: {
  theme: ClockTheme;
  now: Date;
  sunrise?: number;
  sunset?: number;
}) {
  if (theme === 'aurora') return <Aurora now={now} />;
  if (theme === 'gradient') return <GradientSky now={now} />;
  // celestial (default) + any not-yet-distinct themes fall back to the arc.
  return <CelestialArc now={now} sunrise={sunrise} sunset={sunset} />;
}
