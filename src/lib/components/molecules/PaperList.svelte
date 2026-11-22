<script lang="ts">
	import Badge from '#lib/components/atoms/Badge.svelte';
	import Notation from '#lib/components/atoms/Notation.svelte';
	import type { Paper } from '#lib/algorithm-meta.js';

	/** Papers and preprints in the order given; each links where its DOI, arXiv id or URL
	 * resolved when it was added, and stays a plain citation otherwise. */
	let { papers }: { papers: Paper[] } = $props();
	const ROLE: Record<Paper['role'], string> = {
		introduces: 'introduces',
		extends: 'extends',
		analyses: 'analyses',
		applies: 'applies',
		surveys: 'survey'
	};
	const link = (p: Paper) =>
		p.doi ? `https://doi.org/${p.doi}` : p.arxiv ? `https://arxiv.org/abs/${p.arxiv}` : p.url;
</script>

<ol class="papers">
	{#each papers as p (p.title)}
		<li>
			<span class="title">
				{#if link(p)}<a href={link(p)} rel="external">
						<Notation text={p.title} />
					</a>{:else}<Notation text={p.title} />{/if}
			</span>
			<span class="by">
				{p.authors} · {p.year}{#if p.venue}
					· <cite>{p.venue}</cite>{/if}
			</span>
			<span class="meta">
				<Badge tone={p.role === 'introduces' ? 'accent' : 'outline'}>{ROLE[p.role]}</Badge>
				{#if p.doi}<Badge>doi {p.doi}</Badge>{/if}
				{#if p.arxiv}<Badge>arXiv {p.arxiv}</Badge>{/if}
			</span>
		</li>
	{/each}
</ol>

<style>
	.papers {
		display: grid;
		gap: var(--space-4);
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		gap: var(--space-1);
	}
	.title {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
	}
	.by {
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
	cite {
		font-style: italic;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}
</style>
