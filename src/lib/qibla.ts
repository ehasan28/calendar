/** Great-circle bearing from a location to the Kaaba (Mecca), in degrees from true north. */

const KAABA = { lat: 21.4225, lng: 39.8262 };

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export function qiblaBearing(lat: number, lng: number): number {
  const φ = toRad(lat);
  const φk = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lng - lng);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ) * Math.tan(φk) - Math.sin(φ) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function compassLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}
