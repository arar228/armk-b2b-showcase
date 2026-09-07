import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../src/catalog.js';
import { normalizeSearchTerm, parseLimit, searchCatalog } from '../src/search.js';

test('normalizes punctuation and case', () => {
  assert.equal(normalizeSearchTerm('  USB-C / OFFICE  '), 'usb c office');
});

test('finds a product by part number', () => {
  const results = searchCatalog(catalog, 'VWK-104-RU', 10);
  assert.deepEqual(results.map((item) => item.id), ['demo-keyboard-01']);
});

test('matches all search tokens', () => {
  const results = searchCatalog(catalog, 'northstar monitor', 10);
  assert.deepEqual(results.map((item) => item.id), ['demo-monitor-27']);
});

test('bounds result limits', () => {
  assert.equal(parseLimit('0'), 12);
  assert.equal(parseLimit('5000'), 50);
});
