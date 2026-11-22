<script lang="ts">
	import type { Snippet } from 'svelte';

	/** `accent` tints it with the surrounding accent; `outline` is for secondary facts. */
	let { tone = 'outline', children }: { tone?: 'accent' | 'outline'; children: Snippet } = $props();
</script>

<span class="badge {tone}">{@render children()}</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 0.1em 0.6em;
		border-radius: var(--radius-pill);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		line-height: 1.6;
		white-space: nowrap;
	}
	.outline {
		border: var(--border-hair);
		color: var(--color-text-muted);
	}
	.accent {
		border: var(--border-width) solid var(--accent-line);
		background: var(--accent-wash);
		color: var(--color-text-strong);
	}
</style>
