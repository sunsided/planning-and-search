import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CRATES } from '../src/lib/registry.ts';
import { entries, plain, search, withReadmes } from '../src/lib/search.ts';

const all = entries(
	(n) => `/crates/${n}/`,
	(s) => `/#${s}`
);
const top = (q: string) => search(all, q)[0]?.entry.title;

test('an exact crate name comes first', () => {
	assert.equal(top('search-core'), 'search-core');
	assert.equal(top('sas-plus'), 'sas-plus');
});

test('every word must match, in any field', () => {
	assert.equal(top('mapf cbs'), 'mapf-search');
	assert.deepEqual(search(all, 'mapf zzzz'), []);
});

test('algorithm names in descriptions find their crate', () => {
	const crates = (q: string) =>
		search(all, q)
			.filter((h) => h.entry.kind === 'crate')
			.map((h) => h.entry.title);
	assert.equal(crates('LM-cut')[0], 'planning-heuristics');
	assert.equal(crates('pomcp')[0], 'stochastic-search');
	assert.ok(search(all, 'A*').length > 0);
});

test('workspace siblings find the crate that lists them', () => {
	assert.ok(search(all, 'pddl-lsp').some((h) => h.entry.title === 'pddl-validate'));
});

test('categories are found by title', () => {
	const hit = search(all, 'motion planning').find((h) => h.entry.kind === 'category');
	assert.equal(hit?.entry.href, '/#motion');
});

test('a match only in the README gets a snippet that contains it', () => {
	const hit = search(all, 'warehouse').find((h) => h.entry.title === 'mapf-search');
	assert.ok(hit?.snippet?.toLowerCase().includes('warehouse'));
});

test('an empty query lists every crate', () => {
	// Crates only: algorithms and topics show once there is a query.
	assert.equal(search(all, '  ').length, CRATES.length);
});

test('plain() drops link targets and markup', () => {
	assert.equal(plain('use [`pddl`](https://x.dev) and **A\\***'), 'use pddl and A*');
});

test('README text finds more, ranked below page text, with a snippet', () => {
	const extended = withReadmes(all, { 'width-search': 'Compared with LAPKT on the Atari games.' });
	assert.deepEqual(search(all, 'lapkt atari'), []);
	const hit = search(extended, 'lapkt atari')[0];
	assert.equal(hit.entry.title, 'width-search');
	assert.ok(hit.snippet?.includes('LAPKT'));
	assert.ok(hit.score < search(extended, 'width')[0].score);
});

test('algorithms are found by name and alias, and land on their crate', () => {
	const cbs = search(all, 'conflict-based search').find((h) => h.entry.kind === 'algorithm');
	assert.equal(cbs?.entry.href, '/crates/mapf-search/#algo-cbs');
	const lmcut = search(all, 'lm-cut').filter((h) => h.entry.kind === 'algorithm');
	assert.ok(lmcut.length >= 2, 'LM-cut is in more than one crate');
});
