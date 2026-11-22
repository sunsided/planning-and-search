<script lang="ts">
	import Badge from '#lib/components/atoms/Badge.svelte';
	import Icon from '#lib/components/atoms/Icon.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import RichText from '#lib/components/atoms/RichText.svelte';
	import CrateLinks from '#lib/components/molecules/CrateLinks.svelte';
	import type { CrateRef } from '#lib/components/molecules/CrateRefList.svelte';
	import FactList from '#lib/components/molecules/FactList.svelte';
	import InstallSnippet from '#lib/components/molecules/InstallSnippet.svelte';
	import Prose from '#lib/components/molecules/Prose.svelte';
	import CrateRelations from '#lib/components/organisms/CrateRelations.svelte';
	import type { Category, Crate } from '#lib/registry.js';
	import type { Block } from '#lib/richtext.js';

	/** A crate's page: what it is, where it lives, who it is for, how it relates. */
	let {
		crate,
		category,
		back,
		dependencies,
		dependents
	}: {
		crate: Crate;
		category: Category;
		/** The category's place on the overview. */
		back: string;
		dependencies: CrateRef[];
		dependents: CrateRef[];
	} = $props();
</script>

<article class="crate" data-accent style:--accent-h={category.hue}>
	<header class="hero">
		<a class="back" href={back}><Icon name="back" /> {category.title}</a>
		<h1><Node size="0.5em" /><code>{crate.name}</code></h1>
		<p class="lead"><RichText text={crate.description} /></p>
		<CrateLinks name={crate.name} repo={crate.repo} />
		<InstallSnippet name={crate.name} />
	</header>

	<div class="body">
		<div class="main">
			<section aria-labelledby="audience">
				<h2 id="audience">Who it is for</h2>
				<Prose blocks={crate.audience as Block[]} />
			</section>

			{#if crate.siblings.length}
				<section aria-labelledby="siblings">
					<h2 id="siblings">From the same workspace</h2>
					<ul class="siblings">
						{#each crate.siblings as s (s.name)}
							<li>
								<a href="https://crates.io/crates/{s.name}" rel="external"><code>{s.name}</code></a>
								<span><RichText text={s.description} /></span>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>

		<aside class="side" aria-label="Facts">
			<FactList
				facts={[
					{ term: 'Category', value: categoryValue },
					{ term: 'License', value: license },
					...(crate.msrv ? [{ term: 'Minimum Rust', value: msrv }] : []),
					...(crate.keywords.length ? [{ term: 'Keywords', value: keywords }] : [])
				]}
			/>
			<CrateRelations {dependencies} {dependents} />
		</aside>
	</div>
</article>

{#snippet categoryValue()}
	<a href={back}>{category.title}</a>
{/snippet}
{#snippet license()}
	<span>{crate.license.replaceAll(' OR ', ' or ')}</span>
{/snippet}
{#snippet msrv()}
	<span>Rust {crate.msrv}</span>
{/snippet}
{#snippet keywords()}
	{#each crate.keywords as k (k)}<Badge>{k}</Badge>{/each}
{/snippet}

<style>
	.crate {
		display: grid;
		gap: var(--space-7);
		padding-block: var(--space-6);
	}
	.hero {
		display: grid;
		justify-items: start;
		gap: var(--space-4);
		padding-block-end: var(--space-6);
		border-block-end: var(--border-hair);
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text-muted);
		font-size: var(--step--1);
		text-decoration: none;
	}
	.back:hover {
		color: var(--color-text-strong);
	}
	h1 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--step-4);
		overflow-wrap: anywhere;
	}
	h1 code {
		padding: 0;
		background: none;
		font-size: 0.85em;
		font-weight: var(--weight-strong);
	}
	.lead {
		max-inline-size: var(--measure);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}
	.hero :global(.snippet) {
		inline-size: min(100%, var(--snippet-max));
	}
	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(var(--track-aside-min), var(--track-aside-max));
		gap: var(--space-7);
	}
	/* = 52rem; media queries cannot read custom properties. */
	@media (width < 52rem) {
		.body {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.main {
		display: grid;
		align-content: start;
		gap: var(--space-7);
	}
	.main section {
		display: grid;
		gap: var(--space-4);
	}
	h2 {
		font-size: var(--step-2);
	}
	.side {
		display: grid;
		align-content: start;
		gap: var(--space-6);
		padding: var(--space-5);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
	}
	.siblings {
		display: grid;
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}
	.siblings li {
		display: grid;
		gap: var(--space-1);
	}
	.siblings span {
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
</style>
