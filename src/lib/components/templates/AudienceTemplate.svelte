<script lang="ts" module>
	export interface AudienceView {
		title: string;
		lead: string;
		start: {
			crate: string;
			repo: string;
			description: string;
			why: string;
			first: string;
			href: string;
			hue: number;
		};
		crates: { crate: string; description: string; why: string; href: string; hue: number }[];
		algorithms: { name: string; href: string }[];
	}
</script>

<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import Label from '#lib/components/atoms/Label.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import RichText from '#lib/components/atoms/RichText.svelte';
	import CrateLinks from '#lib/components/molecules/CrateLinks.svelte';
	import InstallSnippet from '#lib/components/molecules/InstallSnippet.svelte';

	/** A focused view for one group of readers: where to start, what else, what to read. */
	let { view, back }: { view: AudienceView; back: string } = $props();
</script>

<article class="audience">
	<header class="hero">
		<a class="back" href={back}><Icon name="back" /> Overview</a>
		<h1>For {view.title}</h1>
		<p class="lead">{view.lead}</p>
	</header>

	<section class="start" aria-labelledby="start" data-accent style:--accent-h={view.start.hue}>
		<Label as="h2">Start here</Label>
		<h3 id="start"><Node /><a href={view.start.href}><code>{view.start.crate}</code></a></h3>
		<p class="desc"><RichText text={view.start.description} /></p>
		<p>{view.start.why}</p>
		<p class="first"><strong>First step.</strong> {view.start.first}</p>
		<CrateLinks name={view.start.crate} repo={view.start.repo} />
		<InstallSnippet name={view.start.crate} />
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
				{#each view.algorithms as a (a.href)}<li><a href={a.href}>{a.name}</a></li>{/each}
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
	.start {
		display: grid;
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
