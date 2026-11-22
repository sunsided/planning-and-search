<script lang="ts">
	import Label from '#lib/components/atoms/Label.svelte';
	import CrateRefList, { type CrateRef } from '#lib/components/molecules/CrateRefList.svelte';

	/** How a crate sits among the others: what it builds on and what builds on it. */
	let { dependencies, dependents }: { dependencies: CrateRef[]; dependents: CrateRef[] } = $props();
</script>

<section class="relations" aria-label="Related crates">
	<div>
		<Label as="h3">Builds on</Label>
		<CrateRefList items={dependencies} empty="No other crate of this collection." />
	</div>
	<div>
		<Label as="h3">Used by</Label>
		<CrateRefList items={dependents} empty="No other crate of this collection." />
	</div>
</section>

<style>
	.relations {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--track-column)), 1fr));
		gap: var(--space-5);
	}
	.relations > div {
		display: grid;
		align-content: start;
		gap: var(--space-3);
	}
</style>
