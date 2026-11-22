import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { absolutize, indexPath, intro, latestOf, released, repoOf } from '../scripts/sync-parse.ts';

const line = (vers: string, yanked = false) => JSON.stringify({ vers, yanked, deps: [] });

test('latest is the highest release, not the last published', () => {
	const index = ['0.4.0', '0.10.0', '0.9.0', '0.3.5', '1.0.0-rc.1'].map((v) => line(v)).join('\n');
	assert.equal(latestOf(index)?.vers, '0.10.0');
	assert.equal(latestOf([line('0.1.0'), line('0.2.0', true)].join('\n'))?.vers, '0.1.0');
	assert.equal(latestOf(line('0.1.0-alpha')), undefined);
});

test('index paths follow the sparse index layout', () => {
	assert.deepEqual(['ab', 'abc', 'Search-Core'].map(indexPath), [
		'2/ab',
		'3/a/abc',
		'se/ar/search-core'
	]);
});

test('an item counts as released only when it is public', () => {
	const src =
		'pub fn astar() {}\npub(crate) fn hidden() {}\npub use inner::{Bfs, Dfs};\npub async fn go() {}';
	for (const item of ['astar', 'path::to::astar', 'Bfs', 'Dfs', 'go'])
		assert.ok(released(src, item), item);
	for (const item of ['hidden', 'ast', 'Ida']) assert.ok(!released(src, item), item);
	// A trait method counts with its public trait, and only if the trait declares it somewhere.
	const traits =
		'pub trait Game {\n    fn noisy_moves(&self) {}\n}\ntrait Hidden {\n    fn secret(&self);\n}';
	assert.ok(released(traits, 'Game::noisy_moves'));
	assert.ok(!released(traits, 'Game::missing'));
	assert.ok(!released(traits, 'Hidden::secret'));
	assert.ok(!released(traits, 'noisy_moves'));
});

test('README-relative links point at the released commit', () => {
	const md = '[guide](docs/guide.md) [up](../LICENSE) [web](https://x.dev) [here](#usage)';
	assert.equal(
		absolutize(md, 'o/r', { sha: 'abc', dir: 'crates/foo' }),
		'[guide](https://github.com/o/r/blob/abc/crates/foo/docs/guide.md) [up](https://github.com/o/r/blob/abc/crates/LICENSE) [web](https://x.dev) [here](#usage)'
	);
});

test('the intro drops title, badges, HTML and code', () => {
	const md = '# foo\n\n[![ci](b.svg)](x)\n\nFirst.\n\n```rust\ncode\n```\n\n<p>html</p>\n\nSecond.';
	assert.equal(intro(md), 'First.\n\nSecond.');
});

test('the repository must be on GitHub', () => {
	assert.equal(repoOf('https://github.com/o/r.git', 'x'), 'o/r');
	assert.throws(() => repoOf('https://gitlab.com/o/r', 'x'));
});
