<script lang="ts">
	import ButtonLink from '#lib/components/atoms/ButtonLink.svelte';
	import { links } from '#lib/registry.js';

	/** Out to the crate's three homes: its repository, crates.io and docs.rs. */
	let { name, repo }: { name: string; repo: string } = $props();
	const to = $derived(links({ name, repo }));
</script>

<nav class="links" aria-label="{name} elsewhere">
	<ButtonLink href={to.docs} icon="book" variant="primary" external>Docs on docs.rs</ButtonLink>
	<ButtonLink href={to.crates} icon="package" external>crates.io</ButtonLink>
	<ButtonLink href={to.repo} icon="github" external>{repo}</ButtonLink>
</nav>

<style>
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
</style>
