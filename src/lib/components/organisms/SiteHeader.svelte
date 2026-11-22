<script lang="ts">
	import Logo from '#lib/components/atoms/Logo.svelte';
	import ThemeSwitcher from '#lib/components/molecules/ThemeSwitcher.svelte';
	import CommandPalette from '#lib/components/organisms/CommandPalette.svelte';
	import type { Entry } from '#lib/search.js';
	import { SITE_NAME } from '#lib/site.js';

	let {
		home,
		algorithms,
		load,
		go
	}: {
		home: string;
		algorithms: string;
		load: () => Promise<Entry[]>;
		go: (href: string) => void;
	} = $props();
</script>

<header class="header">
	<a class="brand" href={home}>
		<Logo />
		<span>{SITE_NAME}</span>
	</a>
	<nav class="nav" aria-label="Main">
		<a href={home}>Crates</a>
		<a href={algorithms}>Algorithms</a>
	</nav>
	<div class="tools">
		<CommandPalette {load} {go} />
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
	.nav {
		display: flex;
		gap: var(--space-4);
		margin-inline-end: auto;
		font-size: var(--step--1);
	}
	.nav a {
		color: var(--color-text-muted);
		text-decoration: none;
	}
	.nav a:hover {
		color: var(--color-text-strong);
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
