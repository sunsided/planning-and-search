<script lang="ts">
	import Label from '#lib/components/atoms/Label.svelte';
	import type { Snippet } from 'svelte';

	/** Term/value pairs; each value is a snippet so it can hold badges or links. */
	let { facts }: { facts: { term: string; value: Snippet }[] } = $props();
</script>

<dl class="facts">
	{#each facts as fact (fact.term)}
		<div>
			<Label as="dt">{fact.term}</Label>
			<dd>{@render fact.value()}</dd>
		</div>
	{/each}
</dl>

<style>
	.facts {
		display: grid;
		gap: var(--space-4);
		margin: 0;
	}
	dd {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin: var(--space-1) 0 0;
		color: var(--color-text-strong);
	}
</style>
