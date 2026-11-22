// The traces an algorithm page can name in its meta.json (`trace`). Each runs at build time.

import { bestFirst } from './grid.ts';
import { sampling } from './plane.ts';
import type { Trace } from './types.ts';

export const TRACES: Record<string, () => Trace> = {
	'grid/bfs': () => bestFirst('fifo'),
	'grid/dijkstra': () => bestFirst('g'),
	'grid/a-star': () => bestFirst('g+h'),
	'grid/greedy': () => bestFirst('h'),
	'grid/weighted-a-star': () => bestFirst('g+wh'),
	'plane/rrt': () => sampling(false),
	'plane/rrt-star': () => sampling(true)
};

export type { Trace } from './types.ts';
