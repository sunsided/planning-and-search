<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import { onMount } from 'svelte';

	/** `cargo add <name>`, with a copy button once scripts run. */
	let { name }: { name: string } = $props();
	const command = $derived(`cargo add ${name}`);
	let copied = $state(false);
	let canCopy = $state(false);
	onMount(() => (canCopy = !!navigator.clipboard));

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard refused: the command stays selectable.
		}
	}
</script>

<div class="snippet">
	<pre><code><span class="prompt" aria-hidden="true">$ </span>{command}</code></pre>
	{#if canCopy}
		<button type="button" onclick={copy} aria-label="Copy {command}">
			<Icon name={copied ? 'check' : 'copy'} />
		</button>
		<span class="visually-hidden" role="status">{copied ? 'Copied' : ''}</span>
	{/if}
</div>

<style>
	.snippet {
		display: flex;
		max-inline-size: 100%;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
		border: var(--border-hair);
		border-radius: var(--radius-m);
		background: var(--color-bg-deep);
	}
	/* Scrolls instead of widening the snippet past a narrow card. */
	pre {
		flex: 1;
		min-inline-size: 0;
		margin: 0;
		overflow-x: auto;
		color: var(--color-text-strong);
	}
	.prompt {
		color: var(--color-text-muted);
		user-select: none;
	}
	button {
		display: grid;
		place-items: center;
		inline-size: var(--control-m);
		block-size: var(--control-m);
		border: 0;
		border-radius: var(--radius-s);
		background: none;
		color: var(--color-text-muted);
		cursor: pointer;
	}
	button:hover {
		background: var(--accent-wash);
		color: var(--color-text-strong);
	}
</style>
