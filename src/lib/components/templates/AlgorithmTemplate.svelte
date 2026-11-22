<script lang="ts">
	import Badge from '#lib/components/atoms/Badge.svelte';
	import Icon from '#lib/components/atoms/Icon.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import Notation from '#lib/components/atoms/Notation.svelte';
	import RichText from '#lib/components/atoms/RichText.svelte';
	import Lineage, { type LineageItem } from '#lib/components/molecules/Lineage.svelte';
	import PaperList from '#lib/components/molecules/PaperList.svelte';
	import Pseudocode from '#lib/components/molecules/Pseudocode.svelte';
	import TracePlayer from '#lib/components/organisms/TracePlayer.svelte';
	import type { AlgorithmPage } from '#lib/server/algorithms.js';

	/** An algorithm's page: what it is, how it runs, where it comes from, where to get it. */
	let {
		algorithm: a,
		back,
		before,
		after,
		crateHref
	}: {
		algorithm: AlgorithmPage;
		back: string;
		before: LineageItem[];
		after: LineageItem[];
		crateHref: (crate: string, slug: string) => string;
	} = $props();
</script>

<article class="algorithm" data-accent style:--accent-h={a.hue}>
	<header class="hero">
		<a class="back" href={back}><Icon name="back" /> All algorithms</a>
		<h1><Node size="0.45em" /><span><Notation text={a.name} /></span></h1>
		{#if a.aliases.length}<p class="aliases">
				Also known as {#each a.aliases as alias, i (alias)}{i ? ', ' : ''}<Notation
						text={alias}
					/>{/each}
			</p>{/if}
		<p class="facts">
			<Badge tone="accent">{a.kind}</Badge>
			{#each a.implementations as i (i.crate)}<Badge><code>{i.crate}</code></Badge>{/each}
		</p>
		{#if a.description}<p class="lead"><RichText text={a.description} /></p>{/if}
	</header>

	{#if a.trace}
		<section aria-labelledby="see">
			<h2 id="see">See it run</h2>
			<!-- Keyed: a new algorithm starts its trace at step one, not where the last one stopped. -->
			{#key a.slug}
				<TracePlayer trace={a.trace} label="{a.name} on a small example" />
			{/key}
		</section>
	{/if}

	{#if a.pseudocode}
		<section aria-labelledby="pseudocode">
			<h2 id="pseudocode">Pseudocode</h2>
			<Pseudocode lines={a.pseudocode} label="Pseudocode of {a.name}" />
		</section>
	{/if}

	<section aria-labelledby="implementations">
		<h2 id="implementations">In the crates</h2>
		<ul class="impls">
			{#each a.implementations as i (i.crate)}
				<li>
					<a class="crate" href={crateHref(i.crate, a.slug)}><code>{i.crate}</code></a>
					{#if i.feature}<Badge tone="accent">feature <code>{i.feature}</code></Badge>{/if}
					<p>{i.summary}</p>
					<p class="items">
						{#each i.items as item (item.name)}
							<a href={item.href} rel="external"><code>{item.name}</code></a>
						{/each}
					</p>
				</li>
			{/each}
		</ul>
	</section>

	{#if before.length || after.length}
		<section aria-labelledby="lineage">
			<h2 id="lineage">Lineage</h2>
			<Lineage name={a.name} {before} {after} />
		</section>
	{/if}

	{#if a.papers.length}
		<section aria-labelledby="papers">
			<h2 id="papers">Papers</h2>
			<PaperList papers={a.papers} />
		</section>
	{:else if a.refs.length}
		<section aria-labelledby="papers">
			<h2 id="papers">References</h2>
			<ul class="refs">
				{#each a.refs as r (r)}<li>{r}</li>{/each}
			</ul>
		</section>
	{/if}
</article>

<style>
	.algorithm {
		display: grid;
		gap: var(--space-7);
		padding-block: var(--space-6);
		max-inline-size: 56rem;
	}
	.hero {
		display: grid;
		justify-items: start;
		gap: var(--space-3);
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text-muted);
		font-size: var(--step--1);
		text-decoration: none;
	}
	h1 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--step-4);
	}
	.aliases {
		color: var(--color-text-muted);
	}
	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}
	.lead {
		max-inline-size: var(--measure);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}
	section {
		display: grid;
		gap: var(--space-4);
	}
	h2 {
		font-size: var(--step-2);
	}
	.impls,
	.refs {
		display: grid;
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	.impls li {
		display: grid;
		justify-items: start;
		gap: var(--space-1);
		padding-inline-start: var(--space-4);
		border-inline-start: var(--focus-width) solid var(--accent-line);
	}
	.crate {
		font-weight: var(--weight-strong);
	}
	.impls p {
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
	.refs li {
		color: var(--color-text-muted);
	}
</style>
