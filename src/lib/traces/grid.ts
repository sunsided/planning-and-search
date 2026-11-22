// Best-first search on a small grid, parameterized by what orders the open list. BFS,
// Dijkstra, A*, greedy best-first and Weighted A* differ only in that, so one loop traces
// them all on the same map and their pictures can be compared side by side.

import type { GridFrame, GridScene, Trace } from './types.ts';

const MAP = [
	'..........#.....',
	'..S.......#.....',
	'..........#.....',
	'.....~~~..#..G..',
	'.....~~~..#.....',
	'.....~~~........',
	'..........#.....',
	'..........#.....'
];
const MUD = 4;

export function scene(): GridScene {
	const width = MAP[0].length;
	const scene: GridScene = {
		kind: 'grid',
		width,
		height: MAP.length,
		walls: [],
		costs: [],
		start: 0,
		goal: 0
	};
	MAP.forEach((row, y) =>
		[...row].forEach((c, x) => {
			const i = y * width + x;
			if (c === '#') scene.walls.push(i);
			if (c === '~') scene.costs.push([i, MUD]);
			if (c === 'S') scene.start = i;
			if (c === 'G') scene.goal = i;
		})
	);
	return scene;
}

export type Order = 'fifo' | 'g' | 'g+h' | 'h' | 'g+wh';

const LEGENDS: Record<Order, string> = {
	fifo: 'Open states are expanded in the order they were found, ignoring costs.',
	g: 'Open states are expanded cheapest-first by their cost from the start, g.',
	'g+h': 'Open states are expanded by f = g + h, with h the Manhattan distance to the goal.',
	h: 'Open states are expanded by their estimated distance to the goal alone, h.',
	'g+wh': 'Open states are expanded by f = g + w·h with w = 3, trading optimality for speed.'
};

export function bestFirst(order: Order, weight = 3): Trace {
	const s = scene();
	const { width, height } = s;
	const walls = new Set(s.walls);
	const cost = new Map(s.costs);
	const h = (i: number) =>
		Math.abs((i % width) - (s.goal % width)) +
		Math.abs(Math.floor(i / width) - Math.floor(s.goal / width));
	const key = (i: number, g: number) =>
		order === 'g'
			? g
			: order === 'g+h'
				? g + h(i)
				: order === 'h'
					? h(i)
					: order === 'g+wh'
						? g + weight * h(i)
						: 0;

	const g = new Map([[s.start, 0]]);
	const parent = new Map<number, number>();
	// Insertion order breaks ties, which makes FIFO plain BFS.
	let seq = 0;
	const open = new Map<number, [number, number]>([[s.start, [key(s.start, 0), seq++]]]);
	const closed: number[] = [];
	const frames: GridFrame[] = [];
	const snap = (current: number | null, path: number[], note: string) =>
		frames.push({ open: [...open.keys()], closed: [...closed], current, path, note });

	snap(null, [], 'The start state is the only open state.');
	while (open.size) {
		let best = -1;
		let bestKey: [number, number] = [Infinity, Infinity];
		for (const [i, k] of open)
			if (k[0] < bestKey[0] || (k[0] === bestKey[0] && k[1] < bestKey[1])) [best, bestKey] = [i, k];
		open.delete(best);
		if (best === s.goal) {
			const path = [best];
			while (parent.has(path[0])) path.unshift(parent.get(path[0])!);
			snap(best, path, `Goal reached at cost ${g.get(best)}, after ${closed.length} expansions.`);
			break;
		}
		closed.push(best);
		const x = best % width;
		const y = Math.floor(best / width);
		for (const [dx, dy] of [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1]
		]) {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
			const n = ny * width + nx;
			if (walls.has(n)) continue;
			const ng = g.get(best)! + (cost.get(n) ?? 1);
			if (order === 'fifo' ? g.has(n) : ng >= (g.get(n) ?? Infinity)) continue;
			if (closed.includes(n) && order !== 'h') closed.splice(closed.indexOf(n), 1);
			else if (closed.includes(n)) continue;
			g.set(n, ng);
			parent.set(n, best);
			open.set(n, [key(n, ng), seq++]);
		}
		snap(best, [], `Expand (${x}, ${y}) at g = ${g.get(best)}; ${open.size} open.`);
	}
	return { scene: s, frames, legend: LEGENDS[order] };
}
