import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { lint, notation, parse, parseBlocks, spellings } from '../src/lib/richtext.ts';

test('inline: code, https links, strong, emphasis, escapes', () => {
	assert.deepEqual(
		parse('use `A*`, **fast** and *exact*: A\\* [`pddl`](https://x.dev/p) [b](http://no)'),
		[
			{ kind: 'text', value: 'use ' },
			{ kind: 'code', value: 'A*' },
			{ kind: 'text', value: ', ' },
			{ kind: 'strong', value: 'fast' },
			{ kind: 'text', value: ' and ' },
			{ kind: 'em', value: 'exact' },
			{ kind: 'text', value: ': A* ' },
			{ kind: 'link', value: 'pddl', href: 'https://x.dev/p', code: true },
			{ kind: 'text', value: ' [b](http://no)' }
		]
	);
});

test('a bare star in an algorithm name is not emphasis', () => {
	assert.deepEqual(parse('IDA* and BOA* search'), [
		{ kind: 'text', value: 'IDA* and BOA* search' }
	]);
});

test('blocks: paragraphs, lists, continuation lines', () => {
	assert.deepEqual(parseBlocks('One\ntwo.\n\n- a\n  b\n- c\n\nEnd.'), [
		{ kind: 'p', text: 'One two.' },
		{ kind: 'ul', items: ['a b', 'c'] },
		{ kind: 'p', text: 'End.' }
	]);
});

test('lint flags schedule wording but not motion-planning roadmaps', () => {
	assert.deepEqual(lint('See the roadmap. Not yet stable.'), ['roadmap', 'Not yet']);
	assert.deepEqual(lint('a probabilistic roadmap, a roadmap\ngraph'), []);
	assert.deepEqual(lint('Export is planned. QAOA (planned).'), ['is planned', '(planned)']);
	assert.deepEqual(lint('a planned path, motion planning'), []);
});

test('scripts: a one-letter base with ^ or _, never inside code or longer words', () => {
	assert.deepEqual(notation('h^max'), [
		{ kind: 'text', value: 'h' },
		{ kind: 'sup', value: 'max' }
	]);
	assert.deepEqual(notation('h^{LM-cut}')[1], { kind: 'sup', value: 'LM-cut' });
	assert.deepEqual(notation('h_Ξ')[1], { kind: 'sub', value: 'Ξ' });
	assert.deepEqual(notation('ol_rp'), [{ kind: 'text', value: 'ol_rp' }]);
	assert.deepEqual(parse('`h_max`')[0], { kind: 'code', value: 'h_max' });
	assert.deepEqual(spellings('h^FF'), ['h^FF', 'hFF', 'h_FF']);
});
