<script lang="ts">
	import { notation } from '#lib/richtext.js';

	/** A name as the literature writes it: `h^max` shows h with "max" raised. */
	let { text }: { text: string } = $props();
	const parts = $derived(notation(text));
</script>

{#each parts as p, i (i)}{#if p.kind === 'sup'}<sup>{p.value}</sup>{:else if p.kind === 'sub'}<sub>
			{p.value}
		</sub>{:else}{p.value}{/if}{/each}
