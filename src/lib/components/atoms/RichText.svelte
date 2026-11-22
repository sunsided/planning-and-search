<script lang="ts">
	import { parse } from '#lib/richtext.js';

	/** One line of README prose: code, https links, strong, emphasis, super- and subscripts. */
	let { text }: { text: string } = $props();
	const parts = $derived(parse(text));
</script>

<!-- Kept on one line per part: whitespace inside these elements would show as spaces. -->
<!-- prettier-ignore -->
{#each parts as part, i (i)}{#if part.kind === 'code'}<code>{part.value}</code>{:else if part.kind === 'strong'}<strong>{part.value}</strong>{:else if part.kind === 'em'}<em>{part.value}</em>{:else if part.kind === 'sup'}<sup>{part.value}</sup>{:else if part.kind === 'sub'}<sub>{part.value}</sub>{:else if part.kind === 'link'}<a href={part.href} rel="external">{#if part.code}<code>{part.value}</code>{:else}{part.value}{/if}</a>{:else}{part.value}{/if}{/each}
