import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { languageHref, langOf, localHref } from './index.ts';

test('lang comes from the query string and falls back to English', () => {
  assert.equal(langOf(new URL('https://x.dev/?lang=ru')), 'ru');
  assert.equal(langOf(new URL('https://x.dev/?lang=uk')), 'uk');
  for (const q of ['', '?lang=ua', '?lang=RU', '?lang=', '?lang=en']) assert.equal(langOf(new URL(`https://x.dev/${q}`)), 'en');
});

test('internal links carry the language and keep other params', () => {
  assert.equal(localHref('/recipes/', 'ru'), '/recipes/?lang=ru');
  assert.equal(localHref('/recipes/hummus/?scale=2&v=garlic#steps', 'uk'), '/recipes/hummus/?scale=2&v=garlic&lang=uk#steps');
  assert.equal(localHref('/blog/?lang=ru', 'uk'), '/blog/?lang=uk');
  assert.equal(localHref('/recipes/', 'en'), '/recipes/');
  for (const href of ['https://github.com/sslotsky', '//cdn.example.com/x', 'mailto:sam@saxymofo.com', '#top', undefined]) assert.equal(localHref(href, 'ru'), href);
});

test('language links swap only the lang param', () => {
  const url = new URL('https://x.dev/recipes/toaster-sourdough/?scale=2&lang=ru&s=overnight-pan-proof');
  assert.equal(languageHref(url, 'uk'), '/recipes/toaster-sourdough/?scale=2&lang=uk&s=overnight-pan-proof');
  assert.equal(languageHref(url, 'en'), '/recipes/toaster-sourdough/?scale=2&s=overnight-pan-proof');
});
