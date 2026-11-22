<script lang="ts">
	import Logo from '#lib/components/atoms/Logo.svelte';
	import ThemeSwitcher from '#lib/components/molecules/ThemeSwitcher.svelte';
	import { SITE_NAME } from '#lib/site.js';

	let { home }: { home: string } = $props();
</script>

<header class="header">
	<a class="brand" href={home}>
		<Logo />
		<span>{SITE_NAME}</span>
	</a>
	<ThemeSwitcher />
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
	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
		text-decoration: none;
	}
</style>
