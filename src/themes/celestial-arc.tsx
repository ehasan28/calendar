import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { arcPosition, minutesNow, moonIllumination, phaseOf, skyGradient } from '@/lib/sun';

// Fixed star field (viewBox 0-100 space).
const STARS = [
  [10, 18], [22, 10], [34, 22], [48, 8], [60, 16], [72, 12], [86, 22], [16, 32],
  [42, 30], [64, 28], [80, 34], [90, 14], [6, 26], [28, 16], [54, 24], [76, 20],
];

/**
 * Celestial Arc — the sun rises on the left and arcs to the right by real
 * sunrise→sunset; at night the moon takes the same arc with its current phase.
 * The sky gradient morphs dawn → day → dusk → night.
 */
export function CelestialArc({ now, sunrise, sunset }: { now: Date; sunrise?: number; sunset?: number }) {
  const mins = minutesNow(now);
  const sr = sunrise ?? 360;
  const ss = sunset ?? 1080;
  const phase = phaseOf(mins, sr, ss);
  const [top, bottom] = skyGradient(phase);
  const { isDay, t } = arcPosition(mins, sr, ss);

  // Arc geometry in 0-100 space.
  const x = 8 + t * 84;
  const y = 80 - 60 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
  const { illum } = moonIllumination(now);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
          <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={isDay ? '#2E7D5B' : '#0C1430'} />
            <Stop offset="1" stopColor={isDay ? '#1F5C42' : '#070B1C'} />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="100" height="100" fill="url(#sky)" />

        {/* Stars fade in toward night */}
        {!isDay &&
          STARS.map(([sx, sy], i) => (
            <Circle key={i} cx={sx} cy={sy} r={i % 3 === 0 ? 0.5 : 0.35} fill="#FFFFFF" opacity={0.85} />
          ))}

        {/* Arc guide */}
        <Path d="M 8 80 Q 50 -4 92 80" stroke="#FFFFFF" strokeOpacity={0.14} strokeWidth={0.5} fill="none" />

        {/* Sun or moon */}
        {isDay ? (
          <G>
            <Circle cx={x} cy={y} r={7.5} fill="#FFE08A" opacity={0.35} />
            <Circle cx={x} cy={y} r={4.5} fill="#FFD24A" />
          </G>
        ) : (
          <G>
            <Circle cx={x} cy={y} r={6} fill="#FFFFFF" opacity={0.18} />
            <Circle cx={x} cy={y} r={4} fill="#EAF0FF" opacity={0.4 + 0.6 * illum} />
          </G>
        )}

        {/* Ground silhouette */}
        <Path d="M 0 82 Q 25 76 50 80 Q 75 84 100 78 L 100 100 L 0 100 Z" fill="url(#ground)" />
      </Svg>
    </View>
  );
}
