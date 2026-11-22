import { strict as assert } from 'node:assert';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { check, findCycle } from '../src/lib/algorithm-meta.ts';
import { parse } from '../src/lib/pseudo.ts';
import { ALGORITHMS } from '../src/lib/algorithms.ts';
import { TRACES } from '../src/lib/traces/index.ts';

const known = {
	slugs: new Set(ALGORITHMS.map((a) => a.slug)),
	traces: new Set(Object.keys(TRACES))
};
const dirs = readdirSync('content/algorithms', { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

test('every content directory belongs to a listed algorithm and holds valid content', () => {
	const edges = new Map<string, string[]>();
	for (const slug of dirs) {
		assert.ok(known.slugs.has(slug), `content/algorithms/${slug}: no such algorithm`);
		const metaPath = `content/algorithms/${slug}/meta.json`;
		assert.ok(existsSync(metaPath), `${metaPath} is missing`);
		const meta = check(slug, JSON.parse(readFileSync(metaPath, 'utf8')), known);
		edges.set(
			slug,
			meta.lineage.flatMap((l) => (l.slug ? [l.slug] : []))
		);
		const pseudo = `content/algorithms/${slug}/pseudocode.txt`;
		if (existsSync(pseudo)) parse(readFileSync(pseudo, 'utf8'), pseudo);
		for (const f of readdirSync(`content/algorithms/${slug}`))
			assert.ok(['meta.json', 'pseudocode.txt'].includes(f), `${slug}/${f}: unexpected file`);
	}
	assert.equal(findCycle(edges), null);
});

test('check() rejects what the schema does not allow', () => {
	const ok = { description: 'Finds paths.', papers: [], lineage: [], trace: null };
	check('a-star', ok, known);
	assert.throws(() => check('a-star', { ...ok, extra: 1 }, known));
	assert.throws(() => check('a-star', { ...ok, trace: 'grid/nope' }, known));
	assert.throws(() => check('a-star', { ...ok, description: 'See the roadmap.' }, known));
	const paper = {
		authors: 'A',
		title: 'T',
		year: 1968,
		venue: null,
		doi: 'doi.org/10.1/x',
		arxiv: null,
		url: null,
		role: 'introduces'
	};
	assert.throws(() => check('a-star', { ...ok, papers: [paper] }, known));
	const line = { slug: 'a-star', name: null, relation: 'builds-on', source: 'x' };
	assert.throws(() => check('a-star', { ...ok, lineage: [line] }, known));
	assert.deepEqual(
		findCycle(
			new Map([
				['a', ['b']],
				['b', ['a']]
			])
		),
		['a', 'b', 'a']
	);
});
