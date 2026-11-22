<script lang="ts" module>
	export interface AlgorithmItem {
		slug: string;
		name: string;
		aliases: string[];
		summary: string;
		/** Public items that run it, each with its docs.rs search link. */
		items: { name: string; href: string }[];
		feature: string | null;
	}
</script>

<script lang="ts">
	import Badge from '#lib/components/atoms/Badge.svelte';

	/** The algorithms a crate implements, each anchored as #algo-<slug> for search to land on. */
	let { algorithms }: { algorithms: AlgorithmItem[] } = $props();
</script>

<ul class="algorithms">
	{#each algorithms as a (a.slug)}
		<li id="algo-{a.slug}">
			<div class="head">
				<strong>{a.name}</strong>
				{#if a.aliases.length}<span class="aliases">{a.aliases.join(' · ')}</span>{/if}
				{#if a.feature}<Badge tone="accent">feature <code>{a.feature}</code></Badge>{/if}
			</div>
			<p>{a.summary}</p>
			{#if a.items.length}
				<p class="items">
					{#each a.items as item (item.name)}
						<a href={item.href} rel="external"><code>{item.name}</code></a>
					{/each}
				</p>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.algorithms {
		display: grid;
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		gap: var(--space-1);
		padding-inline-start: var(--space-4);
		border-inline-start: var(--focus-width) solid var(--accent-line);
		scroll-margin-block-start: var(--space-6);
	}
	li:target {
		border-inline-start-color: var(--accent);
		background: linear-gradient(90deg, var(--accent-wash), transparent);
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-1) var(--space-3);
	}
	strong {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
	}
	.aliases {
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
	p {
		max-inline-size: var(--measure);
		font-size: var(--step--1);
	}
	.items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.items a {
		text-decoration: none;
	}
	.items a:hover code {
		background: var(--accent-wash);
	}
</style>
