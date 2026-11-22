<script lang="ts" module>
	export interface CrateRef {
		name: string;
		href: string;
		hue?: number;
		/** Shown when the edge is not a plain dependency. */
		note?: string;
	}
</script>

<script lang="ts">
	import Badge from '#lib/components/atoms/Badge.svelte';
	import Node from '#lib/components/atoms/Node.svelte';

	/** A list of crates that link to their pages, each marked in its category's colour. */
	let { items, empty = 'None' }: { items: CrateRef[]; empty?: string } = $props();
</script>

{#if items.length}
	<ul class="refs">
		{#each items as item (item.name)}
			<li data-accent style:--accent-h={item.hue}>
				<Node size="0.6em" />
				<a href={item.href}><code>{item.name}</code></a>
				{#if item.note}<Badge>{item.note}</Badge>{/if}
			</li>
		{/each}
	</ul>
{:else}
	<p class="empty">{empty}</p>
{/if}

<style>
	.refs {
		display: grid;
		gap: var(--space-2);
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	code {
		background: none;
		padding: 0;
	}
	.empty {
		color: var(--color-text-muted);
	}
</style>
