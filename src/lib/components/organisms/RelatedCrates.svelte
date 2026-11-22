<script lang="ts" module>
	export interface RelatedCrate {
		name: string;
		repo: string;
		line: string;
	}
</script>

<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import { links } from '#lib/registry.js';

	/** Neighbouring crates outside the collection: one line each and their three links. */
	let { crates }: { crates: RelatedCrate[] } = $props();
</script>

<section class="related" aria-labelledby="related-title">
	<h2 id="related-title">Related: estimation and forecasting</h2>
	<p class="intro">
		Planning decides what to do. These crates estimate and predict the state it starts from.
	</p>
	<ul>
		{#each crates as c (c.name)}
			{@const to = links(c)}
			<li>
				<code class="name">{c.name}</code>
				<p>{c.line}</p>
				<p class="links">
					<a href={to.docs} rel="external"><Icon name="book" /> docs.rs</a>
					<a href={to.crates} rel="external"><Icon name="package" /> crates.io</a>
					<a href={to.repo} rel="external"><Icon name="github" /> {c.repo}</a>
				</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.related {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-5);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-bg-deep);
	}
	h2 {
		font-size: var(--step-1);
	}
	.intro {
		color: var(--color-text-muted);
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--track-card)), 1fr));
		gap: var(--space-5);
		margin-block-start: var(--space-2);
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		align-content: start;
		gap: var(--space-2);
	}
	.name {
		justify-self: start;
		padding: 0;
		background: none;
		color: var(--color-text-strong);
		font-size: var(--step-0);
		font-weight: var(--weight-strong);
	}
	li p {
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-4);
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-text-muted);
	}
	.links a:hover {
		color: var(--color-text-strong);
	}
</style>
