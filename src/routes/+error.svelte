<script lang="ts">
	import ButtonLink from '#lib/components/atoms/ButtonLink.svelte';
	import Label from '#lib/components/atoms/Label.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Not found</title>
</svelte:head>

<section class="error">
	<Label>{page.status}</Label>
	<h1>No path to this page</h1>
	<p>The search ran out of nodes. Every crate is listed on the overview.</p>
	<ButtonLink href={resolve('/')} icon="back" variant="primary">All crates</ButtonLink>
</section>

<style>
	.error {
		display: grid;
		justify-items: start;
		gap: var(--space-4);
		padding-block: var(--space-8);
	}
	h1 {
		font-size: var(--step-4);
	}
</style>
