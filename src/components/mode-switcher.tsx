import { ModeAccent } from '@/constants/theme';
import { useColorMode } from '@/hooks/use-theme';
import { SegmentedControl } from '@/components/ui';
import { useStore, type Mode } from '@/store/useStore';

const OPTIONS: { label: string; value: Mode }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Agriculture', value: 'agricultural' },
  { label: 'Islamic', value: 'islamic' },
];

/** Top-level mode switch. Tints its active thumb with the mode's accent. */
export function ModeSwitcher() {
  const mode = useStore((s) => s.settings.mode);
  const setMode = useStore((s) => s.setMode);
  const cm = useColorMode();
  const options = OPTIONS.map((o) => ({ ...o, color: ModeAccent[o.value][cm] }));
  return <SegmentedControl options={options} value={mode} onChange={setMode} />;
}
