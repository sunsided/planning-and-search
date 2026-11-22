<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon, { type IconName } from './Icon.svelte';

	let {
		href,
		icon,
		variant = 'secondary',
		external = false,
		children
	}: {
		href: string;
		icon?: IconName;
		variant?: 'primary' | 'secondary';
		external?: boolean;
		children: Snippet;
	} = $props();
</script>

<a class="button {variant}" {href} rel={external ? 'external noopener' : undefined}>
	{#if icon}<Icon name={icon} />{/if}
	<span>{@render children()}</span>
</a>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--control-l);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-m);
		font-size: var(--step--1);
		font-weight: var(--weight-strong);
		line-height: 1.2;
		text-decoration: none;
		transition:
			background-color var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out);
	}
	.primary {
		border: var(--border-width) solid var(--accent);
		background: var(--accent);
		color: var(--accent-ink);
	}
	.primary:hover {
		background: color-mix(in oklab, var(--accent) 85%, var(--color-text-strong));
	}
	.secondary {
		border: var(--border-width) solid var(--color-line-strong);
		background: var(--color-surface);
		color: var(--color-text-strong);
	}
	.secondary:hover {
		border-color: var(--accent);
		background: var(--accent-wash);
	}
</style>
