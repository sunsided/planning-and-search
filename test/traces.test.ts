import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { TRACES } from '../src/lib/traces/index.ts';

const goalCost = (key: string) => {
	const t = TRACES[key]();
	assert.equal(t.scene.kind, 'grid');
	const last = t.frames.at(-1)!;
	assert.ok('path' in last && last.path.length, `${key} reaches the goal`);
	return { expansions: t.frames.length, note: last.note };
};

test('the grid traces reach the goal; A* expands fewer states than Dijkstra and finds the same cost', () => {
	const d = goalCost('grid/dijkstra');
	const a = goalCost('grid/a-star');
	assert.ok(a.expansions < d.expansions);
	const costOf = (n: string) => Number(/cost (\d+)/.exec(n)![1]);
	assert.equal(costOf(a.note), costOf(d.note));
	assert.ok(costOf(goalCost('grid/bfs').note) >= costOf(d.note));
	assert.ok(costOf(goalCost('grid/greedy').note) >= costOf(d.note));
});

test('RRT* finds a path no longer than RRT from the same samples, and stays small', () => {
	const cost = (key: string) => {
		const t = TRACES[key]();
		const note = t.frames.at(-1)!.note;
		assert.match(note, /best path cost/, key);
		assert.ok(JSON.stringify(t).length < 400_000, `${key} trace size`);
		return Number(/best path cost ([\d.]+)/.exec(note)![1]);
	};
	assert.ok(cost('plane/rrt-star') <= cost('plane/rrt'));
});
