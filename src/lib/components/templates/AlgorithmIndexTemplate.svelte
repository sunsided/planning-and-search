<script lang="ts" module>
	export interface IndexEntry {
		name: string;
		href: string;
		crates: string[];
	}
</script>

<script lang="ts">
	import Label from '#lib/components/atoms/Label.svelte';
	import Notation from '#lib/components/atoms/Notation.svelte';

	/** Every algorithm with a page, grouped by what kind of algorithm it is. */
	let { groups }: { groups: { kind: string; title: string; entries: IndexEntry[] }[] } = $props();
	const count = $derived(groups.reduce((n, g) => n + g.entries.length, 0));
</script>

<div class="index">
	<header>
		<Label>{count} algorithms</Label>
		<h1>Algorithms</h1>
		<p class="lead">
			Every algorithm the crates implement, by kind. Each page says what the algorithm does, where
			it comes from and which crate has it.
		</p>
		<nav aria-label="Kinds">
			<ul class="toc">
				{#each groups as g (g.kind)}<li><a href="#{g.kind}">{g.title}</a></li>{/each}
			</ul>
		</nav>
	</header>
	{#each groups as g (g.kind)}
		<section id={g.kind} aria-labelledby="{g.kind}-title">
			<h2 id="{g.kind}-title">{g.title} <span class="count">{g.entries.length}</span></h2>
			<ul class="list">
				{#each g.entries as e (e.href)}
					<li>
						<a href={e.href}><Notation text={e.name} /></a>
						<span class="crates">{e.crates.join(', ')}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.index {
		display: grid;
		gap: var(--space-7);
		padding-block: var(--space-7) var(--space-6);
	}
	header {
		display: grid;
		gap: var(--space-4);
	}
	h1 {
		font-size: var(--step-4);
	}
	.lead {
		font-size: var(--step-1);
		line-height: var(--leading-snug);
	}
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		padding: 0;
		list-style: none;
	}
	.toc a {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		border: var(--border-hair);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		font-size: var(--step--1);
		text-decoration: none;
	}
	section {
		display: grid;
		gap: var(--space-4);
		scroll-margin-block-start: var(--space-6);
	}
	h2 {
		font-size: var(--step-2);
	}
	.count {
		color: var(--color-text-muted);
		font-weight: var(--weight-text);
	}
	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--track-card)), 1fr));
		gap: var(--space-2) var(--space-5);
		padding: 0;
		list-style: none;
	}
	.list li {
		display: grid;
		padding-block: var(--space-2);
		border-block-end: var(--border-hair);
	}
	.list a {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
		text-decoration: none;
	}
	.list a:hover {
		text-decoration: underline;
	}
	.crates {
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
	}
</style>
