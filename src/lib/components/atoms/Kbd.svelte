<script lang="ts">
	import type { Snippet } from 'svelte';

	/** A key or key combination, as printed on the keycap. */
	let { children }: { children: Snippet } = $props();
</script>

<kbd class="kbd">{@render children()}</kbd>

<style>
	.kbd {
		display: inline-block;
		min-inline-size: 1.6em;
		padding: 0 0.4em;
		border: var(--border-hair);
		border-block-end-width: calc(var(--border-width) * 2);
		border-radius: var(--radius-s);
		background: var(--color-surface);
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		line-height: 1.6;
		text-align: center;
	}
</style>
