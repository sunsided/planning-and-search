<script lang="ts" module>
	export interface AudienceView {
		title: string;
		lead: string;
		/** One crate to begin with, or one per job (then each has `job`). */
		start: {
			job?: string;
			crate: string;
			repo: string;
			description: string;
			why: string;
			first: string;
			href: string;
			hue: number;
		}[];
		crates: { crate: string; description: string; why: string; href: string; hue: number }[];
		algorithms: { name: string; href: string }[];
	}
</script>

<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import Label from '#lib/components/atoms/Label.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import Notation from '#lib/components/atoms/Notation.svelte';
	import RichText from '#lib/components/atoms/RichText.svelte';
	import CrateLinks from '#lib/components/molecules/CrateLinks.svelte';
	import InstallSnippet from '#lib/components/molecules/InstallSnippet.svelte';

	/** A focused view for one group of readers: where to start, what else, what to read. */
	let { view, back }: { view: AudienceView; back: string } = $props();
	const single = $derived(view.start.length === 1);
</script>

<article class="audience">
	<header class="hero">
		<a class="back" href={back}><Icon name="back" /> Overview</a>
		<h1>For {view.title}</h1>
		<p class="lead">{view.lead}</p>
	</header>

	<section class="starts" class:several={!single} aria-label="Start here">
		{#each view.start as s (s.crate)}
			<div class="start" data-accent style:--accent-h={s.hue}>
				<Label as="h2">{s.job ? `Start here: ${s.job}` : 'Start here'}</Label>
				<h3><Node /><a href={s.href}><code>{s.crate}</code></a></h3>
				{#if single}<p class="desc"><RichText text={s.description} /></p>{/if}
				<p>{s.why}</p>
				<p class="first"><strong>First step.</strong> {s.first}</p>
				<!-- Side by side, the cards stay short; the crate page has the links and the install line. -->
				{#if single}
					<CrateLinks name={s.crate} repo={s.repo} />
					<InstallSnippet name={s.crate} />
				{/if}
			</div>
		{/each}
	</section>

	{#if view.crates.length}
		<section aria-labelledby="next">
			<h2 id="next">Then look at</h2>
			<ul class="crates">
				{#each view.crates as c (c.crate)}
					<li data-accent style:--accent-h={c.hue}>
						<a href={c.href}><Node size="0.6em" /><code>{c.crate}</code></a>
						<p>{c.why}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if view.algorithms.length}
		<section aria-labelledby="read">
			<h2 id="read">Algorithms to read first</h2>
			<ul class="algos">
				{#each view.algorithms as a (a.href)}<li>
						<a href={a.href}><Notation text={a.name} /></a>
					</li>{/each}
			</ul>
		</section>
	{/if}
</article>

<style>
	.audience {
		display: grid;
		gap: var(--space-7);
		padding-block: var(--space-6);
		max-inline-size: 56rem;
	}
	.hero {
		display: grid;
		justify-items: start;
		gap: var(--space-4);
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
		font-size: var(--step-4);
	}
	.lead {
		max-inline-size: var(--measure);
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}
	.starts {
		display: grid;
		gap: var(--space-4);
	}
	/* Side by side while each card keeps room for its links; stacked on narrow screens. */
	.starts.several {
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
	}
	.start {
		display: grid;
		align-content: start;
		justify-items: start;
		gap: var(--space-3);
		padding: var(--space-5);
		border: var(--focus-width) solid var(--accent-line);
		border-radius: var(--radius-l);
		background: var(--color-surface);
		box-shadow: var(--shadow-raised);
	}
	.start h3 {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--step-3);
	}
	.several .start {
		grid-template-columns: minmax(0, 1fr);
		padding: var(--space-4);
	}
	.several .start h3 {
		font-size: var(--step-1);
	}
	.start h3 code {
		padding: 0;
		background: none;
	}
	.start p {
		max-inline-size: var(--measure);
	}
	.desc {
		color: var(--color-text-muted);
	}
	.first strong {
		color: var(--color-text-strong);
	}
	section {
		display: grid;
		gap: var(--space-4);
	}
	h2 {
		font-size: var(--step-2);
	}
	.crates {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--track-card)), 1fr));
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	.crates li {
		display: grid;
		align-content: start;
		gap: var(--space-2);
		padding: var(--space-4);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
	}
	.crates a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: var(--weight-strong);
		text-decoration: none;
	}
	.crates code {
		padding: 0;
		background: none;
	}
	.crates p {
		color: var(--color-text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}
	/*
	 * The "Then look at" cards and side-by-side starts link as a whole, as the overview's
	 * crate cards do: the title link covers the card. The single start keeps its own buttons.
	 */
	.crates li,
	.several .start {
		position: relative;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			translate var(--dur-mid) var(--ease-out);
	}
	.crates li:hover,
	.crates li:has(:focus-visible),
	.several .start:hover,
	.several .start:has(:focus-visible) {
		border-color: var(--accent-line);
		translate: 0 var(--lift);
	}
	.crates a::after,
	.several h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}
	.crates a:focus-visible,
	.several h3 a:focus-visible {
		outline: none;
	}
	.crates li:has(a:focus-visible),
	.several .start:has(a:focus-visible) {
		outline: var(--focus-width) solid var(--color-focus);
		outline-offset: var(--focus-offset);
	}
	.several h3 a {
		text-decoration: none;
	}
	.algos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: 0;
		list-style: none;
	}
	.algos a {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		border: var(--border-hair);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		font-size: var(--step--1);
		text-decoration: none;
	}
	.algos a:hover {
		border-color: var(--accent-line);
	}
</style>
