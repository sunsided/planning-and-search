<script lang="ts">
	import Node from '#lib/components/atoms/Node.svelte';
	import CrateCard from '#lib/components/molecules/CrateCard.svelte';
	import type { Category, Crate } from '#lib/registry.js';

	let {
		category,
		crates,
		crateHref
	}: { category: Category; crates: Crate[]; crateHref: (name: string) => string } = $props();
</script>

<section
	class="category"
	id={category.slug}
	aria-labelledby="{category.slug}-title"
	data-accent
	style:--accent-h={category.hue}
>
	<header>
		<h2 id="{category.slug}-title"><Node hollow />{category.title}</h2>
		<p>{category.blurb}</p>
	</header>
	<div class="grid">
		{#each crates as c (c.name)}
			<CrateCard
				name={c.name}
				description={c.description}
				href={crateHref(c.name)}
				hue={category.hue}
			/>
		{/each}
	</div>
</section>

<style>
	.category {
		display: grid;
		gap: var(--space-5);
		scroll-margin-block-start: var(--space-6);
	}
	header {
		display: grid;
		gap: var(--space-2);
	}
	h2 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--step-2);
	}
	header p {
		max-inline-size: var(--measure);
		color: var(--color-text-muted);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--track-card)), 1fr));
		gap: var(--space-4);
	}
</style>
