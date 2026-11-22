import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { ALGORITHMS } from '../src/lib/algorithms.ts';
import { KINDS } from '../src/lib/kinds.ts';
import {
	CATEGORIES,
	CRATES,
	categoryOf,
	crateAt,
	dependents,
	links,
	RELATED,
	relatedCrates
} from '../src/lib/registry.ts';
import { lint } from '../src/lib/richtext.ts';

test('every crate is in exactly one category, and every category entry is a crate', () => {
	const listed = CATEGORIES.flatMap((c) => c.crates);
	assert.deepEqual([...listed].sort(), CRATES.map((c) => c.name).sort());
	assert.equal(new Set(listed).size, listed.length);
});

test('category slugs and hues are distinct', () => {
	assert.equal(new Set(CATEGORIES.map((c) => c.slug)).size, CATEGORIES.length);
	assert.equal(new Set(CATEGORIES.map((c) => c.hue)).size, CATEGORIES.length);
});

test('dependency edges point at crates of the collection', () => {
	for (const c of CRATES)
		for (const d of c.deps) assert.ok(categoryOf(d.name), `${c.name} → ${d.name}`);
	assert.deepEqual(
		dependents('search-core')
			.map((d) => d.name)
			.sort(),
		CRATES.filter((c) => c.deps.some((d) => d.name === 'search-core'))
			.map((c) => c.name)
			.sort()
	);
});

test('links are unversioned and point at the crate', () => {
	assert.deepEqual(links({ name: 'pddl-validate', repo: 'sunsided/pddl-rs' }), {
		repo: 'https://github.com/sunsided/pddl-rs',
		crates: 'https://crates.io/crates/pddl-validate',
		docs: 'https://docs.rs/pddl-validate'
	});
});

test('the snapshot carries only public fields and release-day wording', () => {
	const allowed = [
		'algorithms',
		'name',
		'version',
		'repo',
		'description',
		'license',
		'msrv',
		'keywords',
		'deps',
		'siblings',
		'audience',
		'about'
	];
	for (const c of CRATES) {
		assert.deepEqual(Object.keys(c).sort(), [...allowed].sort(), c.name);
		assert.deepEqual(lint(JSON.stringify(c)), [], c.name);
		assert.ok(c.audience.length, `${c.name}: no audience text`);
	}
});

test('released algorithms are in the curated list, and each names its crate', () => {
	for (const c of CRATES)
		for (const slug of c.algorithms) {
			const a = ALGORITHMS.find((x) => x.slug === slug);
			assert.ok(a, `${c.name}: unknown algorithm ${slug}`);
			assert.ok(
				a.implementations.some((i) => i.crate === c.name),
				`${c.name}: ${slug}`
			);
		}
	assert.equal(new Set(ALGORITHMS.map((a) => a.slug)).size, ALGORITHMS.length);
	for (const a of ALGORITHMS) assert.match(a.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
	// The index groups by kind and leaves out a kind it does not know.
	for (const a of ALGORITHMS) assert.ok(a.kind in KINDS, `${a.slug}: kind ${a.kind}`);
});

test('related crates are synced and stay out of the collection', () => {
	for (const r of RELATED) {
		assert.ok(!CRATES.some((c) => c.name === r.name), `${r.name} is a collection crate`);
		assert.deepEqual(lint(r.line), [], r.name);
	}
	assert.equal(relatedCrates().length, RELATED.length, 'every related crate is in related.json');
});

test('README links to a crate repository resolve to its crate', () => {
	const gh = 'https://github.com/sunsided';
	assert.equal(crateAt(`${gh}/heuristic-search`), 'heuristic-search');
	assert.equal(crateAt(`${gh}/heuristic-search/`), 'heuristic-search');
	assert.equal(crateAt(`${gh}/pddl-rs`), 'pddl');
	assert.equal(crateAt(`${gh}/pddl-rs/tree/main/pddl-validate`), 'pddl-validate');
	assert.equal(crateAt(`${gh}/polyzonotope`), 'polyzonotope');
	// A workspace member without a page, a file, a heading and a foreign repository stay external.
	assert.equal(crateAt(`${gh}/pddl-rs/tree/main/pddl-lsp`), undefined);
	assert.equal(crateAt(`${gh}/resource-timeline/blob/main/examples/colony.rs`), undefined);
	assert.equal(crateAt(`${gh}/width-search#in-games`), undefined);
	assert.equal(crateAt('https://github.com/KCL-Planning/VAL'), undefined);
});
