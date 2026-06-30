/**
 * Generates the app icons in an Apple-Calendar style: a white rounded card with
 * a red header band (weekday) and a large day number. Run: `npm run gen:icons`.
 * The installed icon is static; the live browser-tab favicon (src/lib/dynamic-favicon.ts)
 * redraws to the real date each day.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RED = '#FF3B30';
const DARK = '#1C1C1E';

const now = new Date();
const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
const DAY = String(now.getDate());

/** Build an Apple-style calendar SVG at `size`. `foreground` = transparent bg + safe zone (Android adaptive). */
function svg(size, { foreground = false } = {}) {
  const pad = foreground ? size * 0.18 : 0;
  const x = pad;
  const y = pad;
  const w = size - pad * 2;
  const h = size - pad * 2;
  const r = (foreground ? 0.18 : 0.16) * w;
  const headerH = h * 0.3;
  const weekdaySize = headerH * 0.46;
  const daySize = h * 0.46;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="card"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/></clipPath>
  </defs>
  <g clip-path="url(#card)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFFFF"/>
    <rect x="${x}" y="${y}" width="${w}" height="${headerH}" fill="${RED}"/>
    <text x="${size / 2}" y="${y + headerH * 0.5}" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif"
      font-size="${weekdaySize}" font-weight="700" letter-spacing="${weekdaySize * 0.08}"
      text-anchor="middle" dominant-baseline="central">${WEEKDAY}</text>
    <text x="${size / 2}" y="${y + headerH + (h - headerH) * 0.52}" fill="${DARK}" font-family="Helvetica, Arial, sans-serif"
      font-size="${daySize}" font-weight="600" text-anchor="middle" dominant-baseline="central">${DAY}</text>
  </g>
</svg>`;
}

async function emit(relPath, size, opts) {
  const out = resolve(root, relPath);
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(size, opts))).png().resize(size, size).toFile(out);
  console.log('  ✓', relPath, `${size}px`);
}

const targets = [
  ['public/icon-180.png', 180, {}],
  ['public/icon-192.png', 192, {}],
  ['public/icon-512.png', 512, {}],
  ['assets/images/icon.png', 1024, {}],
  ['assets/images/favicon.png', 96, {}],
  ['assets/images/splash-icon.png', 256, {}],
  ['assets/images/icon-foreground.png', 432, { foreground: true }],
];

console.log(`Generating Calendar icons (${WEEKDAY} ${DAY})…`);
for (const [p, s, o] of targets) await emit(p, s, o);
console.log('Done.');
