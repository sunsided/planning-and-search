import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from '../src/lib/pseudo.ts';

const spec = readFileSync('content/algorithms/PSEUDOCODE.md', 'utf8');
const example = /```\n([\s\S]*?)```/.exec(spec)![1];

test("the spec's own example parses", () => {
	const lines = parse(example);
	assert.equal(lines[0].depth, 0);
	assert.deepEqual(
		lines[0].tokens.slice(0, 3).map((t) => [t.kind, t.value]),
		[
			['keyword', 'algorithm'],
			['text', ' '],
			['routine', 'A*']
		]
	);
	const open = lines.find((l) => l.tokens.some((t) => t.value === 'OPEN'))!;
	assert.ok(open.tokens.some((t) => t.kind === 'set' && t.value === 'OPEN'));
	assert.ok(open.tokens.some((t) => t.kind === 'comment'));
});

for (const [name, bad] of [
	['assignment with :=', 'algorithm X(a)\n  a := 1'],
	['an end line', 'algorithm X(a)\n  while a do\n    a ← 1\n  end'],
	['a code comment', 'algorithm X(a)\n  a ← 1 // no'],
	['a tab', 'algorithm X(a)\n\ta ← 1'],
	['odd indentation', 'algorithm X(a)\n   a ← 1'],
	['a block that is not indented', 'algorithm X(a)\n  while a do\n  a ← 1'],
	['indentation without a block', 'algorithm X(a)\n  a ← 1\n    b ← 2'],
	['no header', 'a ← 1'],
	['an empty block at the end', 'algorithm X(a)\n  if a then'],
	['ASCII comparison', 'algorithm X(a)\n  if a <= 1 then\n    return a'],
	['a blank line', 'algorithm X(a)\n\n  return a']
])
	test(`rejects ${name}`, () => assert.throws(() => parse(bad)));

test('repeat … until, procedures and input/output', () => {
	parse(
		'algorithm X(a)\n  input: a number a\n  output: nothing\n  repeat\n    a ← a − 1\n  until a = 0\nprocedure Y(b)\n  skip'
	);
});
