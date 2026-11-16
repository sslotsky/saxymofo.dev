import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { mergeIngredients } from './ingredients.ts';

test('variations remove from base, replace groups, then append items and new groups', () => {
  const base = [{ group: 'Base', items: ['1 RAW Garlic clove', 'salt'] }, { items: ['water'] }];
  const variation = {
    name: 'Roasted', remove: ['raw garlic'],
    ingredients: [{ items: ['oil'] }],
    add: [{ group: 'Base', items: ['4 roasted cloves'] }, { items: ['lemon'] }, { group: 'Top', items: ['nuts'] }],
  };
  const before = JSON.stringify({ base, variation });
  assert.deepEqual(mergeIngredients(base, variation), [
    { group: 'Base', items: ['salt', '4 roasted cloves'] },
    { items: ['oil', 'lemon'] }, { group: 'Top', items: ['nuts'] },
  ]);
  assert.equal(JSON.stringify({ base, variation }), before);
});
test('empty, base-only and unmatched removal keep valid lists', () => {
  assert.deepEqual(mergeIngredients(), []);
  assert.deepEqual(mergeIngredients([], { name: 'Empty', remove: ['garlic'] }), []);
  const base = [{ items: ['salt'] }];
  assert.deepEqual(mergeIngredients(base), base);
  assert.deepEqual(mergeIngredients(base, { name: 'Other', remove: ['garlic'] }), base);
});
