<script lang="ts">
	import type { Snippet } from 'svelte';

	/** The small uppercase line above a heading or a group of facts. */
	let { as = 'p', children }: { as?: 'p' | 'span' | 'dt' | 'h2' | 'h3'; children: Snippet } =
		$props();
</script>

<svelte:element this={as} class="label">{@render children()}</svelte:element>

<style>
	.label {
		margin: 0;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		font-weight: var(--weight-text);
		letter-spacing: var(--tracking-label);
		line-height: var(--leading-snug);
		text-transform: uppercase;
	}
</style>
