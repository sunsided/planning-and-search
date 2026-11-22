<script lang="ts">
	/** A category's marker: a graph node in its accent. Decorative. */
	let { size = '0.75em', hollow = false }: { size?: string; hollow?: boolean } = $props();
</script>

<span class="node" class:hollow style:--size={size} aria-hidden="true"></span>

<style>
	.node {
		display: inline-block;
		flex: none;
		inline-size: var(--size);
		block-size: var(--size);
		border: var(--focus-width) solid var(--accent);
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 var(--halo-width) var(--accent-wash);
	}
	.hollow {
		background: var(--color-surface);
	}
</style>
