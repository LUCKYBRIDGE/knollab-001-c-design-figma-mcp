import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const script = readFileSync(resolve(root, 'explorer.js'), 'utf8');

function render(search) {
  const versionLinks = ['1', '2', '3'].map(version => ({ dataset: { version }, classList: { toggle() {} }, setAttribute() {}, removeAttribute() {} }));
  const experimentLinks = ['a', 'b', 'c', 'd'].map(experiment => ({ dataset: { experiment }, href: '' }));
  const frame = { src: '', title: '' };
  const elements = { 'context-title': { textContent: '' }, 'open-original': { href: '' }, 'experience-frame': frame };
  const document = {
    querySelectorAll(selector) { return selector === '[data-version]' ? versionLinks : experimentLinks; },
    getElementById(id) { return elements[id]; }
  };
  runInNewContext(script, { window: { location: { search } }, document, URLSearchParams, Object });
  return { frame, versionLinks, experimentLinks };
}

test('versions 1–3 load complete local snapshots', () => {
  for (const version of ['1', '2', '3']) {
    const { frame, experimentLinks } = render(`?version=${version}`);
    assert.equal(frame.src, `versions/v${version}/index.html`);
    assert.ok(existsSync(resolve(root, frame.src)));
    assert.equal(experimentLinks[3].href, 'https://luckybridge.github.io/knollab-001-d-design-figma-mcp-actively/?version=1');
  }
});

test('invalid version uses completed version 3', () => {
  assert.equal(render('?version=999').frame.src, 'versions/v3/index.html');
});
