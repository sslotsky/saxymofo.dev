import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { parseQuantity, scaleQuantity } from './quantities.ts';

test('leading quantities and ranges scale', () => {
  for (const [line, expected] of [
    ['1 cup flour', '2 cup flour'], ['1.5 cups flour', '3 cups flour'],
    ['1/2 cup tahini', '1 cup tahini'], ['1 1/2 cups chickpeas', '3 cups chickpeas'],
    ['½ tsp cumin', '1 tsp cumin'], ['1½ cups', '3 cups'],
    ['¼ cup', '1/2 cup'], ['¾ cup', '1 1/2 cup'], ['⅓ cup', '2/3 cup'],
    ['⅔ cup', '1 1/3 cup'], ['⅛ tsp', '1/4 tsp'],
    ['2-3 tbsp juice', '4–6 tbsp juice'], ['2 to 3 tbsp juice', '4–6 tbsp juice'],
    ['2', '4'], ['50 g oil', '100 g oil'], ['0.125 kg rice', '0.25 kg rice'],
    ['0.125 l water', '0.25 l water'], ['25 ml water', '50 ml water'],
    ['375g bread flour', '750g bread flour'],
    ['375 g bread flour (about 3 cups)', '750 g bread flour (about 6 cups)'],
    ['3 cups (about 400 g) raw whole cashews', '6 cups (about 800 g) raw whole cashews'],
    ['250g water (about 1 cup + 1 tbsp)', '500g water (about 2 cup + 2 tbsp)'],
    ['4 cloves (from 1 head)', '8 cloves (from 1 head)'],
  ]) assert.equal(scaleQuantity(line, 2), expected);
});
test('rounding, empty, malformed and invalid inputs', () => {
  assert.equal(scaleQuantity('1 cup', 1/3), '1/3 cup');
  assert.equal(scaleQuantity('10 g salt', 1/3), '3 g salt');
  for (const line of ['', 'salt, to taste', '1/0 cup', 'a cup']) {
    assert.equal(parseQuantity(line), null);
    assert.equal(scaleQuantity(line, 2), line);
  }
  for (const scale of [0, -1, NaN, Infinity]) assert.equal(scaleQuantity('1 cup', scale), '1 cup');
});
