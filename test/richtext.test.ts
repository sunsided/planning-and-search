import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { lint, parse, parseBlocks } from '../src/lib/richtext.ts';

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
});
