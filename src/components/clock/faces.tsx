import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';

import { Tabular } from '@/constants/theme';

const TEXT = '#FFFFFF';
const textShadow = {
  textShadowColor: 'rgba(0,0,0,0.35)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 8,
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Minimal digital HH:MM:SS. `dim` is used by nightstand mode. */
export function DigitalSeconds({ now, dim, size = 64 }: { now: Date; dim?: boolean; size?: number }) {
  const color = dim ? 'rgba(255,255,255,0.78)' : TEXT;
  return (
    <Text style={[styles.digital, Tabular, textShadow, { color, fontSize: size }]}>
      {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
    </Text>
  );
}

/** Apple-style analog face with a sweeping second hand. */
export function AnalogFace({ now, size = 240 }: { now: Date; size?: number }) {
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const secA = s * 6;
  const minA = m * 6 + s * 0.1;
  const hourA = h * 30 + m * 0.5;
  const c = 50;

  const hand = (angle: number, len: number, w: number, color: string, round = true) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return (
      <Line
        x1={c}
        y1={c}
        x2={c + len * Math.cos(rad)}
        y2={c + len * Math.sin(rad)}
        stroke={color}
        strokeWidth={w}
        strokeLinecap={round ? 'round' : 'butt'}
      />
    );
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={c} cy={c} r={47} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.45)" strokeWidth={1} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const r1 = 47;
        const r2 = i % 3 === 0 ? 40 : 43;
        return (
          <Line
            key={i}
            x1={c + r1 * Math.cos(a)}
            y1={c + r1 * Math.sin(a)}
            x2={c + r2 * Math.cos(a)}
            y2={c + r2 * Math.sin(a)}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
            strokeLinecap="round"
          />
        );
      })}
      <G>
        {hand(hourA, 26, 3, '#FFFFFF')}
        {hand(minA, 38, 2.2, '#FFFFFF')}
        {hand(secA, 41, 1, '#FF453A')}
        <Circle cx={c} cy={c} r={2} fill="#FF453A" />
      </G>
    </Svg>
  );
}

/** Flip-style time: digit pairs in soft cards. */
export function FlipFace({ now }: { now: Date }) {
  const parts = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())];
  return (
    <View style={styles.flipRow}>
      {parts.map((p, i) => (
        <View key={i} style={styles.flipGroup}>
          <View style={styles.flipCard}>
            <View style={styles.flipDivider} />
            <Text style={[styles.flipText, Tabular]}>{p}</Text>
          </View>
          {i < 2 ? <Text style={styles.flipColon}>:</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  digital: { fontWeight: '300', letterSpacing: 2 },
  flipRow: { flexDirection: 'row', alignItems: 'center' },
  flipGroup: { flexDirection: 'row', alignItems: 'center' },
  flipCard: {
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flipDivider: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  flipText: { color: '#fff', fontSize: 48, fontWeight: '500' },
  flipColon: { color: '#fff', fontSize: 40, fontWeight: '400', marginHorizontal: 6, opacity: 0.8 },
});
