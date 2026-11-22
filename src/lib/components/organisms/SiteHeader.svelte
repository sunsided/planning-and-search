<script lang="ts">
	import Logo from '#lib/components/atoms/Logo.svelte';
	import ThemeSwitcher from '#lib/components/molecules/ThemeSwitcher.svelte';
	import CommandPalette from '#lib/components/organisms/CommandPalette.svelte';
	import type { Entry } from '#lib/search.js';
	import { SITE_NAME } from '#lib/site.js';

	let { home, entries, go }: { home: string; entries: Entry[]; go: (href: string) => void } =
		$props();
</script>

<header class="header">
	<a class="brand" href={home}>
		<Logo />
		<span>{SITE_NAME}</span>
	</a>
	<div class="tools">
		<CommandPalette {entries} {go} />
		<ThemeSwitcher />
	</div>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		inline-size: min(var(--page-max), 100% - 2 * var(--gutter));
		margin-inline: auto;
		padding-block: var(--space-4);
		border-block-end: var(--border-hair);
	}
	.tools {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
		text-decoration: none;
	}
</style>
