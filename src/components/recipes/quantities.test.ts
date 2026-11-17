import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { parseQuantity, scaleQuantity } from './quantities.ts';

test('leading quantities and ranges scale', () => {
  for (const [line, expected] of [
    ['1 cup flour', '2 cups flour'], ['1.5 cups flour', '3 cups flour'],
    ['1/2 cup tahini', '1 cup tahini'], ['1 1/2 cups chickpeas', '3 cups chickpeas'],
    ['½ tsp cumin', '1 tsp cumin'], ['1½ cups', '3 cups'],
    ['¼ cup', '1/2 cup'], ['¾ cup', '1 1/2 cups'], ['⅓ cup', '2/3 cup'],
    ['⅔ cup', '1 1/3 cups'], ['⅛ tsp', '1/4 tsp'],
    ['2-3 tbsp juice', '4–6 tbsp juice'], ['2 to 3 tbsp juice', '4–6 tbsp juice'],
    ['2', '4'], ['50 g oil', '100 g oil'], ['0.125 kg rice', '0.25 kg rice'],
    ['0.125 l water', '0.25 l water'], ['25 ml water', '50 ml water'],
    ['375g bread flour', '750g bread flour'],
    ['375 g bread flour (about 3 cups)', '750 g bread flour (about 6 cups)'],
    ['3 cups (about 400 g) raw whole cashews', '6 cups (about 800 g) raw whole cashews'],
    ['250g water (about 1 cup + 1 tbsp)', '500g water (about 2 cups + 2 tbsp)'],
    ['4 cloves (from 1 head)', '8 cloves (from 1 head)'],
  ]) assert.equal(scaleQuantity(line, 2), expected);
});
test('units inflect in ingredients, yields and parentheticals without changing abbreviations', () => {
  for (const [single, plural] of Object.entries({ cup: 'cups', can: 'cans', loaf: 'loaves', clove: 'cloves', head: 'heads', slice: 'slices', jar: 'jars', pinch: 'pinches', handful: 'handfuls', pepper: 'peppers', batch: 'batches', serving: 'servings', portion: 'portions' })) {
    assert.equal(scaleQuantity(`1 ${single}`, 2), `2 ${plural}`);
    assert.equal(scaleQuantity(`2 ${plural}`, .5), `1 ${single}`);
    assert.equal(scaleQuantity(`1 ${plural}`, .5), `1/2 ${single}`);
  }
  for (const unit of ['g', 'tbsp', 'tsp', 'oz', 'ml']) assert.equal(scaleQuantity(`1 ${unit}`, 2), `2 ${unit}`);
  assert.equal(scaleQuantity('1 small garlic clove', 2), '2 small garlic cloves');
  assert.equal(scaleQuantity('1 batch coconut-cashew dinner sauce', 2), '2 batches coconut-cashew dinner sauce');
  assert.equal(scaleQuantity('1 dinner portion', 2), '2 dinner portions');
  assert.equal(scaleQuantity('1 jarred roasted red pepper, patted completely dry', 2), '2 jarred roasted red peppers, patted completely dry');
  assert.equal(scaleQuantity('2 jarred roasted red peppers, patted completely dry', .5), '1 jarred roasted red pepper, patted completely dry');
  assert.equal(scaleQuantity('1 cup whole cloves', 2), '2 cups whole cloves');
  assert.equal(scaleQuantity('1 tbsp whole cloves', .5), '1/2 tbsp whole cloves');
});
test('package sizes stay fixed, while parentheticals after the ingredient scale', () => {
  assert.equal(scaleQuantity('1 (15 oz) can chickpeas, drained', 2), '2 (15 oz) cans chickpeas, drained');
  assert.equal(scaleQuantity('2 (15 oz) cans chickpeas', .5), '1 (15 oz) can chickpeas');
  assert.equal(scaleQuantity('1 can chickpeas (15 oz)', 2), '2 cans chickpeas (30 oz)');
  assert.equal(scaleQuantity('375 g bread flour (about 3 cups)', 2), '750 g bread flour (about 6 cups)');
});
test('french toast oil, eggs and pinches scale cleanly at preset sizes', () => {
  for (const [scale, oil, eggs, salt] of [
    [.5, '1 1/3 tbsp avocado oil', '1 egg', '1/2 pinch kosher salt'],
    [1, '2 2/3 tbsp avocado oil', '2 eggs', '1 pinch kosher salt'],
    [2, '5 1/3 tbsp avocado oil', '4 eggs', '2 pinches kosher salt'],
    [3, '8 tbsp avocado oil', '6 eggs', '3 pinches kosher salt'],
  ] as const) {
    assert.equal(scaleQuantity('2 2/3 tbsp avocado oil', scale), oil);
    assert.equal(scaleQuantity('2 eggs', scale), eggs);
    assert.equal(scaleQuantity('1 pinch kosher salt', scale), salt);
  }
});
test('cashew recipe ranges, counted nouns and pound abbreviations scale', () => {
  assert.equal(scaleQuantity('1/2–3/4 cup water', 2), '1–1 1/2 cups water');
  assert.equal(scaleQuantity('1 lb raw whole cashews (about 3 cups)', 2), '2 lb raw whole cashews (about 6 cups)');
  assert.equal(scaleQuantity('1 lb (about 3 cups) raw whole cashews', 2), '2 lb (about 6 cups) raw whole cashews');
  assert.equal(scaleQuantity('1 lb raw whole cashews (about 3 cups)', .5), '1/2 lb raw whole cashews (about 1 1/2 cups)');
  assert.equal(scaleQuantity('1 roasted garlic clove', 2), '2 roasted garlic cloves');
  assert.equal(scaleQuantity('1 small pinch fine sea salt', 2), '2 small pinches fine sea salt');
  assert.equal(scaleQuantity('1 pinch ground turmeric', 2), '2 pinches ground turmeric');
  assert.equal(scaleQuantity('1 lb', 2), '2 lb');
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
