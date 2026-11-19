import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { activeOption, isActive, optionErrors, optionSlug, recipeOptionErrors, recipeSearch } from './options.ts';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { scaleQuantity } from './quantities.ts';

const schedules = [{ name: 'Overnight Pan Proof' }, { name: 'Overnight Bulk Ferment' }];

test('slugs are lowercase and hyphenated', () => {
  assert.equal(optionSlug('80% Hydration (Ultra-Open)'), '80-hydration-ultra-open');
  assert.equal(optionSlug('Overnight Pan Proof'), 'overnight-pan-proof');
  assert.equal(optionSlug('base'), 'base');
});

test('?s= and ?v= pick a known option and fall back to base', () => {
  assert.equal(activeOption(schedules, 'overnight-pan-proof'), 'overnight-pan-proof');
  for (const selected of [null, '', 'base', 'unknown', 'Overnight Pan Proof']) assert.equal(activeOption(schedules, selected), 'base', String(selected));
  assert.equal(activeOption(undefined, 'overnight-pan-proof'), 'base');
  assert.equal(activeOption([], 'overnight-pan-proof'), 'base');
});

test('URL state keeps scale and v, and omits s on the base schedule', () => {
  assert.equal(recipeSearch('?s=old&x=1', { scale: 2, variation: 'base', schedule: 'base' }), '?x=1&scale=2&v=base');
  assert.equal(recipeSearch('', { scale: 0.5, variation: '67-hydration-sandwich', schedule: 'overnight-pan-proof' }), '?scale=0.5&v=67-hydration-sandwich&s=overnight-pan-proof');
});

test('<Schedule> and <Variation> show independently alongside <Q> scaling', () => {
  const state = { variation: '67-hydration-sandwich', schedule: 'overnight-bulk-ferment', scale: 2 };
  const body = [
    { kind: 'variation', name: 'base' }, { kind: 'variation', name: '67% Hydration (Sandwich)' },
    { kind: 'schedule', name: 'base' }, { kind: 'schedule', name: 'Overnight Pan Proof' }, { kind: 'schedule', name: 'Overnight Bulk Ferment' },
  ];
  const visible = body.filter(block => isActive(block.kind === 'variation' ? state.variation : state.schedule, block.name)).map(block => block.name);
  assert.deepEqual(visible, ['67% Hydration (Sandwich)', 'Overnight Bulk Ferment']);
  assert.ok(isActive('base', 'base') && !isActive('base', 'Overnight Pan Proof'));
  assert.equal(scaleQuantity('375 g', state.scale), '750 g');
});

test('option schema rejects reserved, duplicate, empty and non-string fields', () => {
  assert.deepEqual(optionErrors('schedules', undefined, []), []);
  assert.deepEqual(optionErrors('schedules', [{ name: 'A', description: 'x', time: '2 days' }], ['description', 'time']), []);
  assert.deepEqual(optionErrors('schedules', 'Overnight', []), ['schedules must be a list']);
  assert.deepEqual(optionErrors('schedules', [{ name: 'Base' }, { name: 'Over Night' }, { name: 'over-night' }, { name: '%%' }, 'x', { name: 'B', time: 2 }], ['time']), [
    'schedules[0].name "Base" is reserved for the base option',
    'schedules[2].name "over-night" duplicates slug "over-night"',
    'schedules[3].name must be a non-empty string',
    'schedules[4] must be an object',
    'schedules[5].time must be a string',
  ]);
  assert.deepEqual(recipeOptionErrors({ baseScheduleName: 1, variations: [{ name: 'A', description: 2 }] }), ['baseScheduleName must be a string', 'variations[0].description must be a string']);
});
