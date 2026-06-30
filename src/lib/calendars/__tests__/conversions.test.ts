import assert from 'node:assert/strict';
import { test } from 'node:test';

import { toBangla, BANGLA_MONTHS_EN, seasonForDate } from '../bangla';
import { toHijri } from '../hijri';
import { monthGrid, daysBetween, ymd } from '../gregorian';
import { toNumerals } from '../numerals';

test('Pohela Boishakh: 14 Apr 2026 = 1 Boishakh 1433', () => {
  const b = toBangla(new Date(2026, 3, 14));
  assert.equal(b.day, 1);
  assert.equal(b.month, 1);
  assert.equal(BANGLA_MONTHS_EN[b.month - 1], 'Boishakh');
  assert.equal(b.year, 1433);
});

test('Bangla year rolls over: 13 Apr 2026 is still 1432 (Choitro)', () => {
  const b = toBangla(new Date(2026, 3, 13));
  assert.equal(b.year, 1432);
  assert.equal(b.month, 12); // Choitro
});

test('Language Martyrs Day: 21 Feb is 8 Falgun (fixed anchor)', () => {
  // Holds for the revised calendar across years.
  for (const y of [2025, 2026, 2027, 2028]) {
    const b = toBangla(new Date(y, 1, 21));
    assert.equal(BANGLA_MONTHS_EN[b.month - 1], 'Falgun', `month for ${y}`);
    assert.equal(b.day, 8, `day for ${y}`);
  }
});

test('Victory Day: 16 Dec is 1 Poush (fixed anchor)', () => {
  for (const y of [2025, 2026, 2027]) {
    const b = toBangla(new Date(y, 11, 16));
    assert.equal(BANGLA_MONTHS_EN[b.month - 1], 'Poush', `month for ${y}`);
    assert.equal(b.day, 1, `day for ${y}`);
  }
});

test('Season mapping: Boishakh→Summer, Poush→Winter', () => {
  assert.equal(seasonForDate(new Date(2026, 3, 14)).en, 'Summer'); // Boishakh
  assert.equal(seasonForDate(new Date(2025, 11, 16)).en, 'Winter'); // Poush
});

test('Hijri (Umm al-Qura) produces a valid date for today-ish', () => {
  const h = toHijri(new Date(2026, 5, 30)); // 30 Jun 2026
  assert.ok(h.year > 1400 && h.year < 1500, `year ${h.year}`);
  assert.ok(h.month >= 1 && h.month <= 12, `month ${h.month}`);
  assert.ok(h.day >= 1 && h.day <= 30, `day ${h.day}`);
});

test('Hijri known anchor: 1 Jan 2026 ≈ Rajab 1447', () => {
  const h = toHijri(new Date(2026, 0, 1));
  assert.equal(h.year, 1447);
  assert.equal(h.month, 7); // Rajab — Umm al-Qura
});

test('monthGrid returns 42 cells starting on a Sunday', () => {
  const grid = monthGrid(2026, 6); // June 2026
  assert.equal(grid.length, 42);
  assert.equal(grid[0].getDay(), 0);
  // June 1 2026 is a Monday → grid[1] should be June 1
  assert.equal(daysBetween(grid[0], ymd(2026, 6, 1)), 1);
});

test('numerals transliterate', () => {
  assert.equal(toNumerals(2026, 'bangla'), '২০২৬');
  assert.equal(toNumerals(30, 'arabic'), '٣٠');
  assert.equal(toNumerals('14 April', 'western'), '14 April');
});
