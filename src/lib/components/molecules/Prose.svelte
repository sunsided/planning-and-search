<script lang="ts">
	import RichText from '#lib/components/atoms/RichText.svelte';
	import type { Block } from '#lib/richtext.js';

	/** README blocks: paragraphs and lists; `internal` as for RichText. */
	let { blocks, internal }: { blocks: Block[]; internal?: (href: string) => string | undefined } =
		$props();
</script>

<div class="prose">
	{#each blocks as block, i (i)}
		{#if block.kind === 'p'}
			<p><RichText text={block.text} {internal} /></p>
		{:else}
			<ul>
				{#each block.items as item, j (j)}
					<li><RichText text={item} {internal} /></li>
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
