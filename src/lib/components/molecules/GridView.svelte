<script lang="ts">
	import type { GridFrame, GridScene } from '#lib/traces/types.js';

	/** One frame of a grid search, in the shared visual language. Decorative to assistive tech;
	 * the player describes each frame in text. */
	let { scene, frame }: { scene: GridScene; frame: GridFrame } = $props();

	const CELL = 10;
	const xy = (i: number) => [(i % scene.width) * CELL, Math.floor(i / scene.width) * CELL];
	const center = (i: number) => xy(i).map((v) => v + CELL / 2);
	const pathD = $derived(
		frame.path.map((i, k) => `${k ? 'L' : 'M'}${center(i).join(' ')}`).join(' ')
	);
</script>

<svg
	class="grid"
	viewBox="0 0 {scene.width * CELL} {scene.height * CELL}"
	aria-hidden="true"
	preserveAspectRatio="xMidYMid meet"
>
	<rect class="ground" width={scene.width * CELL} height={scene.height * CELL} />
	{#each scene.costs as [i] (i)}<rect
			class="mud"
			x={xy(i)[0]}
			y={xy(i)[1]}
			width={CELL}
			height={CELL}
		/>{/each}
	{#each frame.closed as i (i)}<rect
			class="closed"
			x={xy(i)[0] + 1}
			y={xy(i)[1] + 1}
			width={CELL - 2}
			height={CELL - 2}
			rx="1"
		/>{/each}
	{#each frame.open as i (i)}<rect
			class="open"
			x={xy(i)[0] + 1}
			y={xy(i)[1] + 1}
			width={CELL - 2}
			height={CELL - 2}
			rx="1"
		/>{/each}
	{#each scene.walls as i (i)}<rect
			class="wall"
			x={xy(i)[0]}
			y={xy(i)[1]}
			width={CELL}
			height={CELL}
		/>{/each}
	{#if frame.current !== null}<rect
			class="current"
			x={xy(frame.current)[0] + 1.5}
			y={xy(frame.current)[1] + 1.5}
			width={CELL - 3}
			height={CELL - 3}
			rx="1.5"
		/>{/if}
	{#if frame.path.length}<path class="path" d={pathD} />{/if}
	<circle class="endpoint" cx={center(scene.start)[0]} cy={center(scene.start)[1]} r={CELL * 0.3} />
	<circle
		class="endpoint goal"
		cx={center(scene.goal)[0]}
		cy={center(scene.goal)[1]}
		r={CELL * 0.3}
	/>
</svg>

<style>
	/* Strokes are screen pixels from the tokens, whatever the drawing's scale. */
	* {
		vector-effect: non-scaling-stroke;
	}
	.grid {
		inline-size: 100%;
		block-size: auto;
	}
	.ground {
		fill: var(--viz-ground);
	}
	.mud {
		fill: var(--viz-mud);
	}
	.wall {
		fill: var(--viz-wall);
	}
	.closed {
		fill: var(--viz-closed);
	}
	.open {
		fill: var(--viz-open);
		stroke: var(--viz-open-edge);
		stroke-width: var(--viz-stroke-thin);
	}
	.current {
		fill: none;
		stroke: var(--viz-current);
		stroke-width: var(--viz-stroke);
	}
	.path {
		fill: none;
		stroke: var(--viz-path);
		stroke-width: var(--viz-stroke-bold);
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.endpoint {
		fill: var(--viz-endpoint);
	}
	.goal {
		fill: none;
		stroke: var(--viz-endpoint);
		stroke-width: var(--viz-stroke-thin);
	}
</style>
