<script lang="ts">
	import '@fontsource-variable/ibm-plex-sans';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/600.css';
	import '#lib/design/tokens.css';
	import '#lib/design/base.css';
	import SiteFooter from '#lib/components/organisms/SiteFooter.svelte';
	import SiteHeader from '#lib/components/organisms/SiteHeader.svelte';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<a class="skip" href="#main">Skip to content</a>
<SiteHeader home={resolve('/')} />
<main id="main">
	{@render children()}
</main>
<SiteFooter />

<style>
	main {
		inline-size: min(var(--page-max), 100% - 2 * var(--gutter));
		margin-inline: auto;
	}
	.skip {
		position: absolute;
		inset-block-start: var(--space-2);
		inset-inline-start: var(--space-2);
		z-index: 20;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-s);
		background: var(--accent);
		color: var(--accent-ink);
		translate: 0 -200%;
	}
	.skip:focus {
		translate: 0;
	}
</style>
