<script lang="ts" module>
	export interface LineageItem {
		name: string;
		href: string | null;
		relation: string;
	}
</script>

<script lang="ts">
	import Label from '#lib/components/atoms/Label.svelte';

	/** Where an algorithm comes from and what came after it, as two short lists around it. */
	let { name, before, after }: { name: string; before: LineageItem[]; after: LineageItem[] } =
		$props();
	const RELATION: Record<string, string> = {
		'builds-on': 'builds on',
		generalizes: 'generalizes',
		specializes: 'specializes',
		combines: 'combines',
		replaces: 'replaces'
	};
</script>

<div class="lineage">
	<div class="column">
		<Label as="h3">Comes from</Label>
		{#each before as b (b.name)}
			<p>
				<span class="rel">{RELATION[b.relation]}</span>
				{#if b.href}<a href={b.href}>{b.name}</a>{:else}<span>{b.name}</span>{/if}
			</p>
		{:else}
			<p class="none">Nothing on this site.</p>
		{/each}
	</div>
	<div class="this" aria-hidden="true"><span>{name}</span></div>
	<div class="column">
		<Label as="h3">Led to</Label>
		{#each after as a (a.name)}
			<p>
				{#if a.href}<a href={a.href}>{a.name}</a>{:else}<span>{a.name}</span>{/if}
				<span class="rel">{RELATION[a.relation]} it</span>
			</p>
		{:else}
			<p class="none">Nothing on this site.</p>
		{/each}
	</div>
</div>

<style>
	.lineage {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: var(--space-4);
	}
	@media (width < 40rem) {
		/* A literal: media queries cannot read custom properties. */
		.lineage {
			grid-template-columns: 1fr;
		}
		.this {
			display: none;
		}
	}
	.column {
		display: grid;
		gap: var(--space-2);
	}
	p {
		font-size: var(--step--1);
	}
	.rel {
		color: var(--color-text-muted);
		font-size: var(--step--2);
	}
	.none {
		color: var(--color-text-muted);
	}
	.this span {
		display: inline-block;
		padding: var(--space-2) var(--space-4);
		border: var(--focus-width) solid var(--accent);
		border-radius: var(--radius-pill);
		background: var(--accent-wash);
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
		white-space: nowrap;
	}
</style>
