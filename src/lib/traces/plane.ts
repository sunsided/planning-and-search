// RRT and RRT* in the unit square around two walls, from one seed, so both grow from the
// same samples and the difference is what RRT* does with them: choose the cheapest parent in
// a neighbourhood and rewire the neighbours through the new node.

import type { PlaneFrame, PlaneScene, Trace } from './types.ts';

export function scene(): PlaneScene {
	return {
		kind: 'plane',
		obstacles: [
			[0.3, 0, 0.08, 0.62],
			[0.62, 0.38, 0.08, 0.62]
		],
		start: [0.12, 0.12],
		goal: [0.88, 0.88],
		goalRadius: 0.06
	};
}

/** mulberry32: a tiny seeded generator, so the trace is the same on every build. */
function rng(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

type P = [number, number];
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function sampling(star: boolean): Trace {
	const s = scene();
	const random = rng(7);
	const STEP = 0.07;
	const ITERATIONS = 360;
	const EVERY = 8;
	const RADIUS = 0.16;
	const GOAL_BIAS = 0.05;

	const blocked = (p: P) =>
		p[0] < 0 ||
		p[1] < 0 ||
		p[0] > 1 ||
		p[1] > 1 ||
		s.obstacles.some(([x, y, w, h]) => p[0] >= x && p[0] <= x + w && p[1] >= y && p[1] <= y + h);
	const free = (a: P, b: P) => {
		const n = Math.ceil(dist(a, b) / 0.005);
		for (let i = 0; i <= n; i++)
			if (blocked([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n])) return false;
		return true;
	};

	const nodes: [number, number, number][] = [[...s.start, -1]];
	const cost = [0];
	const frames: PlaneFrame[] = [];
	let rewired: [number, number][] = [];
	const best = () => {
		let b = -1;
		nodes.forEach((n, i) => {
			if (dist([n[0], n[1]], s.goal) <= s.goalRadius && (b < 0 || cost[i] < cost[b])) b = i;
		});
		if (b < 0) return [];
		const path = [b];
		while (nodes[path[0]][2] >= 0) path.unshift(nodes[path[0]][2]);
		return path;
	};
	const snap = (sample: P | null, note: string) =>
		frames.push({
			nodes: nodes.map((n) => [...n] as [number, number, number]),
			sample,
			rewired,
			path: best(),
			note
		});

	snap(null, 'The tree is just the start.');
	for (let it = 1; it <= ITERATIONS; it++) {
		const q: P = random() < GOAL_BIAS ? s.goal : [random(), random()];
		let near = 0;
		nodes.forEach((n, i) => {
			if (dist([n[0], n[1]], q) < dist([nodes[near][0], nodes[near][1]], q)) near = i;
		});
		const from: P = [nodes[near][0], nodes[near][1]];
		const d = dist(from, q);
		const x: P =
			d <= STEP
				? q
				: [from[0] + ((q[0] - from[0]) * STEP) / d, from[1] + ((q[1] - from[1]) * STEP) / d];
		if (blocked(x) || !free(from, x)) continue;

		let parent = near;
		let c = cost[near] + dist(from, x);
		const hood: number[] = [];
		if (star) {
			nodes.forEach((n, i) => {
				if (dist([n[0], n[1]], x) <= RADIUS && free([n[0], n[1]], x)) hood.push(i);
			});
			for (const i of hood) {
				const ci = cost[i] + dist([nodes[i][0], nodes[i][1]], x);
				if (ci < c) [parent, c] = [i, ci];
			}
		}
		const id = nodes.push([x[0], x[1], parent]) - 1;
		cost.push(c);
		if (star)
			for (const i of hood) {
				const ci = c + dist(x, [nodes[i][0], nodes[i][1]]);
				if (i !== parent && ci < cost[i]) {
					rewired.push([i, nodes[i][2]]);
					nodes[i][2] = id;
					const delta = cost[i] - ci;
					// Descendants get cheaper by the same amount.
					const stack = [i];
					while (stack.length) {
						const k = stack.pop()!;
						cost[k] -= delta;
						nodes.forEach((n, j) => n[2] === k && stack.push(j));
					}
				}
			}
		if (it % EVERY === 0) {
			const path = best();
			snap(
				q,
				`${it} samples, ${nodes.length} nodes` +
					(path.length ? `; best path cost ${cost[path.at(-1)!].toFixed(2)}` : '; no path yet') +
					(star && rewired.length ? `; ${rewired.length} rewired since the last frame` : '')
			);
			rewired = [];
		}
	}
	return {
		scene: s,
		frames,
		legend: star
			? 'Each new node takes the cheapest parent within a radius, then offers itself as a cheaper parent to its neighbours (rewiring).'
			: 'Each new node joins the nearest node of the tree, one step towards a random sample.'
	};
}
