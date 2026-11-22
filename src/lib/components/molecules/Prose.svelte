<script lang="ts">
	import RichText from '#lib/components/atoms/RichText.svelte';
	import type { Block } from '#lib/richtext.js';

	/** README blocks: paragraphs and lists. */
	let { blocks }: { blocks: Block[] } = $props();
</script>

<div class="prose">
	{#each blocks as block, i (i)}
		{#if block.kind === 'p'}
			<p><RichText text={block.text} /></p>
		{:else}
			<ul>
				{#each block.items as item, j (j)}
					<li><RichText text={item} /></li>
				{/each}
			</ul>
		{/if}
	{/each}
</div>

<style>
	.prose {
		display: grid;
		gap: var(--space-4);
		max-inline-size: var(--measure);
	}
	ul {
		display: grid;
		gap: var(--space-3);
		padding-inline-start: 1.25em;
	}
	li::marker {
		color: var(--accent);
	}
	.prose :global(a) {
		text-decoration-color: var(--accent-line);
	}
</style>
