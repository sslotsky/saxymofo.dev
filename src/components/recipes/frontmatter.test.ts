import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

function flowLists(source: string) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, 'Expected frontmatter at the start of the file');
  const lines = frontmatter[1].split(/\r?\n/);
  return lines.flatMap((line, index) => {
    const field = line.match(/^\s*(?:-\s+)?(?:items|remove|"items"|"remove"|'items'|'remove')\s*:\s*(.*)$/);
    if (!field) return [];
    const value = field[1].trim();
    const next = value && !value.startsWith('#') ? value : lines.slice(index + 1).find(line => line.trim() && !line.trim().startsWith('#'))?.trim() ?? '';
    return /^(?:(?:&\S+|!\S+)\s+)*\[/.test(next) ? [index + 2] : [];
  });
}

test('ingredient flow-list guard accepts block lists and rejects inline, empty and multiline flow lists', () => {
  assert.deepEqual(flowLists('---\nitems:\n  - 1 pepper, patted dry\nremove:\n  - raw garlic\n---\n'), []);
  assert.deepEqual(flowLists('---\nitems:\nremove:\n---\n'), []);
  for (const field of ['items: [1 pepper, patted dry]', 'remove: []', 'items:\n  # ingredients\n  [1 pepper]', '- items: &ingredients [1 pepper]', '"remove": [garlic]']) {
    assert.ok(flowLists(`---\n${field}\n---\n`).length, field);
  }
  assert.throws(() => flowLists('No frontmatter'), /Expected frontmatter/);
});

test('every recipe and the copy-ready template use block lists for items and remove', async () => {
  const root = new URL('../../routes/recipes/', import.meta.url);
  const directories = (await readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory());
  const files = (await Promise.all(directories.map(async entry => {
    const directory = new URL(`${entry.name}/`, root);
    return (await readdir(directory)).includes('index.mdx') ? [new URL('index.mdx', directory)] : [];
  }))).flat();
  assert.ok(files.length > 0, 'Expected recipe files');
  files.push(new URL('../../../docs/recipe-template.mdx', import.meta.url));
  for (const file of files) {
    assert.deepEqual(flowLists(await readFile(file, 'utf8')), [], `${file.pathname}: items/remove flow lists split ingredients at commas; use block lists`);
  }
});
