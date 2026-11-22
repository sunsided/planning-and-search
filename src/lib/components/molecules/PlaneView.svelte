<script lang="ts">
	import type { PlaneFrame, PlaneScene } from '#lib/traces/types.js';

	/** One frame of a sampling planner in the unit square, in the shared visual language.
	 * Decorative to assistive tech; the player describes each frame in text. */
	let { scene, frame }: { scene: PlaneScene; frame: PlaneFrame } = $props();

	const S = 100;
	// y grows upwards in the scene, downwards in SVG.
	const px = (p: [number, number] | number[]) => [p[0] * S, (1 - p[1]) * S];
	const edges = $derived(
		frame.nodes
			.filter((n) => n[2] >= 0)
			.map((n) => {
				const [x1, y1] = px(n);
				const [x2, y2] = px(frame.nodes[n[2]]);
				return `M${x1} ${y1}L${x2} ${y2}`;
			})
			.join('')
	);
	const pathD = $derived(
		frame.path.map((i, k) => `${k ? 'L' : 'M'}${px(frame.nodes[i]).join(' ')}`).join(' ')
	);
	const rewiredD = $derived(
		frame.rewired
			.map(([child]) => {
				const n = frame.nodes[child];
				if (!n || n[2] < 0) return '';
				return `M${px(n).join(' ')}L${px(frame.nodes[n[2]]).join(' ')}`;
			})
			.join('')
	);
</script>

<svg class="plane" viewBox="0 0 {S} {S}" aria-hidden="true">
	<rect class="ground" width={S} height={S} />
	{#each scene.obstacles as [x, y, w, h], i (i)}
		<rect class="wall" x={x * S} y={(1 - y - h) * S} width={w * S} height={h * S} />
	{/each}
	<circle
		class="goal-region"
		cx={px(scene.goal)[0]}
		cy={px(scene.goal)[1]}
		r={scene.goalRadius * S}
	/>
	<path class="tree" d={edges} />
	{#if rewiredD}<path class="rewired" d={rewiredD} />{/if}
	{#each frame.nodes as n, i (i)}<circle class="node" cx={px(n)[0]} cy={px(n)[1]} r="0.45" />{/each}
	{#if frame.path.length}<path class="path" d={pathD} />{/if}
	{#if frame.sample}<circle
			class="sample"
			cx={px(frame.sample)[0]}
			cy={px(frame.sample)[1]}
			r="1.2"
		/>{/if}
	<circle class="endpoint" cx={px(scene.start)[0]} cy={px(scene.start)[1]} r="1.8" />
</svg>

<style>
	/* Strokes are screen pixels from the tokens, whatever the drawing's scale. */
	* {
		vector-effect: non-scaling-stroke;
	}
	.plane {
		inline-size: 100%;
		block-size: auto;
	}
	.ground {
		fill: var(--viz-ground);
	}
	.wall {
		fill: var(--viz-wall);
	}
	.goal-region {
		fill: var(--viz-open);
		stroke: var(--viz-endpoint);
		stroke-width: var(--viz-stroke-thin);
	}
	.tree {
		fill: none;
		stroke: var(--viz-tree);
		stroke-width: var(--viz-stroke-thin);
	}
	.rewired {
		fill: none;
		stroke: var(--viz-rewired);
		stroke-width: var(--viz-stroke);
	}
	.node {
		fill: var(--viz-tree);
	}
	.path {
		fill: none;
		stroke: var(--viz-path);
		stroke-width: var(--viz-stroke-bold);
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sample {
		fill: none;
		stroke: var(--viz-current);
		stroke-width: var(--viz-stroke);
	}
	.endpoint {
		fill: var(--viz-endpoint);
	}
</style>
