<script lang="ts">
	import AlgorithmIndexTemplate from '#lib/components/templates/AlgorithmIndexTemplate.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/site.js';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const groups = $derived(
		data.groups.map((g) => ({
			...g,
			entries: g.entries.map((e) => ({
				...e,
				href: resolve('/algorithms/[slug]', { slug: e.slug })
			}))
		}))
	);
	const description = 'Every algorithm the planning and search crates implement, by kind.';
</script>

<svelte:head>
	<title>Algorithms · {SITE_NAME}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE_URL}/algorithms/" />
</svelte:head>

<AlgorithmIndexTemplate {groups} />
