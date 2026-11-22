<script lang="ts">
	import Label from '#lib/components/atoms/Label.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import AudienceGrid, { type AudienceCard } from '#lib/components/organisms/AudienceGrid.svelte';
	import CategorySection from '#lib/components/organisms/CategorySection.svelte';
	import RelatedCrates, { type RelatedCrate } from '#lib/components/organisms/RelatedCrates.svelte';
	import type { Category, Crate } from '#lib/registry.js';

	let {
		categories,
		crateHref,
		audiences,
		related
	}: {
		categories: { category: Category; crates: Crate[] }[];
		crateHref: (name: string) => string;
		audiences: AudienceCard[];
		related: RelatedCrate[];
	} = $props();
	const count = $derived(categories.reduce((n, c) => n + c.crates.length, 0));
</script>

<div class="home">
	<header class="hero">
		<Label>{count} Rust crates</Label>
		<h1>Planning and search, one crate at a time</h1>
		<p class="lead">
			Heuristic and multi-objective graph search, classical planning with its heuristics,
			multi-agent pathfinding, planning under uncertainty, adversarial game-tree search, constraint
			satisfaction, motion planning, reachability and onboard scheduling. Each crate does one job,
			shares the same core traits where it makes sense, and documents the algorithms it implements.
		</p>
		<nav aria-label="Categories">
			<ul class="toc">
				{#each categories as { category } (category.slug)}
					<li data-accent style:--accent-h={category.hue}>
						<a href="#{category.slug}"><Node size="0.55em" />{category.title}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<AudienceGrid {audiences} />

	{#each categories as { category, crates } (category.slug)}
		<CategorySection {category} {crates} {crateHref} />
	{/each}

	{#if related.length}<RelatedCrates crates={related} />{/if}
</div>

<style>
	.home {
		display: grid;
		gap: var(--space-8);
		padding-block: var(--space-7) var(--space-6);
	}
	.hero {
		display: grid;
		gap: var(--space-4);
	}
	h1 {
		font-size: var(--step-4);
	}
	.lead {
		font-size: var(--step-1);
		line-height: var(--leading-snug);
		color: var(--color-text);
	}
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-block-start: var(--space-3);
		padding: 0;
		list-style: none;
	}
	.toc a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-3);
		border: var(--border-hair);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		font-size: var(--step--1);
		text-decoration: none;
	}
	.toc a:hover {
		border-color: var(--accent-line);
	}
</style>
