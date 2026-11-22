<script lang="ts">
	import { parse } from '#lib/richtext.js';

	/** One line of README prose: code, https links, strong and emphasis; nothing else. */
	let { text }: { text: string } = $props();
	const parts = $derived(parse(text));
</script>

{#each parts as part, i (i)}
	{#if part.kind === 'code'}<code>{part.value}</code>{:else if part.kind === 'strong'}<strong>
			{part.value}
		</strong>{:else if part.kind === 'em'}<em>{part.value}</em>{:else if part.kind === 'link'}<a
			href={part.href}
			rel="external"
		>
			{#if part.code}<code>{part.value}</code>{:else}{part.value}{/if}
		</a>{:else}{part.value}{/if}
{/each}
