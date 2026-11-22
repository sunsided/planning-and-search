<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import GridView from '#lib/components/molecules/GridView.svelte';
	import PlaneView from '#lib/components/molecules/PlaneView.svelte';
	import type { Trace } from '#lib/traces/types.js';
	import { onDestroy } from 'svelte';

	/**
	 * Steps through a trace. Nothing moves until the reader presses play; the slider and the
	 * step buttons work with the keyboard, and each frame is described in text.
	 */
	let { trace, label }: { trace: Trace; label: string } = $props();

	const id = $props.id();
	let step = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined = $state();
	const last = $derived(trace.frames.length - 1);
	const frame = $derived(trace.frames[Math.min(step, last)]);

	function stop() {
		clearInterval(timer);
		timer = undefined;
	}
	function play() {
		if (timer) return stop();
		if (step >= last) step = 0;
		timer = setInterval(() => {
			if (step >= last) stop();
			else step++;
		}, 140);
	}
	const go = (to: number) => {
		stop();
		step = Math.max(0, Math.min(last, to));
	};
	onDestroy(stop);

	const KEY_LEGEND = $derived(
		trace.scene.kind === 'grid'
			? [
					['open', 'open'],
					['closed', 'closed'],
					['current', 'expanding'],
					['path', 'path'],
					['wall', 'wall'],
					['mud', 'costly cell']
				]
			: [
					['tree', 'tree'],
					['current', 'sample'],
					['rewired', 'rewired edge'],
					['path', 'best path'],
					['wall', 'obstacle']
				]
	);
</script>

<figure class="player" aria-labelledby="{id}-caption">
	<div class="stage">
		{#if trace.scene.kind === 'grid'}
			<GridView scene={trace.scene} frame={frame as never} />
		{:else}
			<PlaneView scene={trace.scene} frame={frame as never} />
		{/if}
	</div>

	<div class="controls">
		<button type="button" onclick={() => go(0)} aria-label="First step">
			<Icon name="first" />
		</button>
		<button type="button" onclick={() => go(step - 1)} aria-label="Previous step">
			<Icon name="back" />
		</button>
		<button type="button" class="play" onclick={play} aria-label={timer ? 'Pause' : 'Play'}>
			<Icon name={timer ? 'pause' : 'play'} />
		</button>
		<button type="button" onclick={() => go(step + 1)} aria-label="Next step">
			<Icon name="arrow" />
		</button>
		<input
			type="range"
			min="0"
			max={last}
			value={step}
			oninput={(e) => go(Number(e.currentTarget.value))}
			aria-label="Step"
			aria-valuetext="Step {step + 1} of {last + 1}: {frame.note}"
		/>
		<span class="counter">{step + 1}/{last + 1}</span>
	</div>

	<p class="note" aria-live={timer ? 'off' : 'polite'}>{frame.note}</p>

	<figcaption id="{id}-caption">
		<span class="visually-hidden">{label}. </span>{trace.legend}
		<span class="key">
			{#each KEY_LEGEND as [cls, text] (cls)}
				<span><i class="swatch {cls}"></i>{text}</span>
			{/each}
		</span>
	</figcaption>
</figure>

<style>
	.player {
		display: grid;
		gap: var(--space-3);
		margin: 0;
		padding: var(--space-4);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
	}
	.stage {
		overflow: hidden;
		border-radius: var(--radius-m);
		border: var(--border-hair);
	}
	.controls {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	button {
		display: grid;
		place-items: center;
		inline-size: var(--control-m);
		block-size: var(--control-m);
		border: var(--border-hair);
		border-radius: var(--radius-m);
		background: var(--color-surface);
		color: var(--color-text-strong);
		cursor: pointer;
	}
	button:hover {
		border-color: var(--accent);
		background: var(--accent-wash);
	}
	.play,
	.play:hover {
		border-color: var(--accent);
		background: var(--accent);
		color: var(--accent-ink);
	}
	input {
		flex: 1;
		min-inline-size: 0;
		accent-color: var(--accent);
	}
	.counter {
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-variant-numeric: tabular-nums;
	}
	.note {
		min-block-size: 1.6em;
		color: var(--color-text-strong);
		font-family: var(--font-mono);
		font-size: var(--step--1);
	}
	figcaption {
		display: grid;
		gap: var(--space-2);
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
	.key {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-4);
		font-size: var(--step--2);
	}
	.key span {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}
	.swatch {
		display: inline-block;
		inline-size: 0.9em;
		block-size: 0.9em;
		border-radius: var(--radius-s);
	}
	.swatch.open {
		background: var(--viz-open);
		box-shadow: inset 0 0 0 var(--viz-stroke-thin) var(--viz-open-edge);
	}
	.swatch.closed {
		background: var(--viz-closed);
	}
	.swatch.current {
		box-shadow: inset 0 0 0 var(--viz-stroke) var(--viz-current);
	}
	.swatch.path {
		background: var(--viz-path);
	}
	.swatch.wall {
		background: var(--viz-wall);
	}
	.swatch.mud {
		background: var(--viz-mud);
	}
	.swatch.tree {
		background: var(--viz-tree);
	}
	.swatch.rewired {
		background: var(--viz-rewired);
	}
</style>
