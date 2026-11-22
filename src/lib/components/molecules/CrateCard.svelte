<script lang="ts">
	import Node from '#lib/components/atoms/Node.svelte';
	import RichText from '#lib/components/atoms/RichText.svelte';

	/** One crate in a category grid; the whole card links to its page. */
	let {
		name,
		description,
		href,
		hue
	}: { name: string; description: string; href: string; hue?: number } = $props();
</script>

<article class="card" data-accent style:--accent-h={hue}>
	<h3>
		<Node />
		<a {href}><code>{name}</code></a>
	</h3>
	<p><RichText text={description} /></p>
</article>

<style>
	.card {
		position: relative;
		display: grid;
		align-content: start;
		gap: var(--space-2);
		padding: var(--space-4) var(--space-5) var(--space-5);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
		box-shadow: var(--shadow-raised);
		transition:
			border-color var(--dur-fast) var(--ease-out),
			translate var(--dur-mid) var(--ease-out);
	}
	.card:hover,
	.card:has(:focus-visible) {
		border-color: var(--accent-line);
		translate: 0 var(--lift);
	}
	h3 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--step-1);
	}
	h3 code {
		padding: 0;
		background: none;
		font-size: 0.92em;
		font-weight: var(--weight-strong);
	}
	a {
		text-decoration: none;
	}
	/* The link covers the card, so the whole card is the target. */
	a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}
	a:focus-visible {
		outline: none;
	}
	.card:has(a:focus-visible) {
		outline: var(--focus-width) solid var(--color-focus);
		outline-offset: var(--focus-offset);
	}
	p {
		color: var(--color-text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}
</style>
