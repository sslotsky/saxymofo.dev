import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { LINKS } from '../../data/links.ts';
// @ts-ignore Node's native TypeScript runner needs the source extension.
import { hasAffiliateReferences, referenceIds } from './references.ts';

test('affiliate detection handles affiliate, technique, empty and unknown references', () => {
  assert.equal(hasAffiliateReferences('<Ref id="usa-pan-1lb">pans</Ref>'), true);
  assert.equal(hasAffiliateReferences("<Ref\n id='ka-fresh-starter' />"), true);
  assert.equal(hasAffiliateReferences('<Ref id="sune-coil-fold" />'), false);
  assert.equal(hasAffiliateReferences('No references'), false);
  assert.equal(hasAffiliateReferences('<Ref id="unknown" />'), false);
  assert.equal(hasAffiliateReferences('<Ref id="toString" />'), false);
  assert.deepEqual(referenceIds('<Ref id="unknown" />'), ['unknown']);
});

test('all English and translated recipe reference ids exist in LINKS', async () => {
  let count = 0;
  async function scan(directory: URL) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      if (entry.isDirectory()) await scan(file);
      else if (entry.name === 'index.mdx') {
        count++;
        for (const id of referenceIds(await readFile(file, 'utf8'))) {
          assert.ok(Object.hasOwn(LINKS, id), `${file.pathname}: unknown reference ${id}`);
        }
      }
    }
  }
  await scan(new URL('../../routes/recipes/', import.meta.url));
  await scan(new URL('../../i18n/content/', import.meta.url));
  assert.ok(count > 0);
});
