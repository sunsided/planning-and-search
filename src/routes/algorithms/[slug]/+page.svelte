<script lang="ts">
	import AlgorithmTemplate from '#lib/components/templates/AlgorithmTemplate.svelte';
	import { parse } from '#lib/richtext.js';
	import { SITE_NAME, SITE_URL } from '#lib/site.js';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const a = $derived(data.algorithm);
	const href = (slug: string | null) => (slug ? resolve('/algorithms/[slug]', { slug }) : null);
	const description = $derived(
		(a.description &&
			parse(a.description)
				.map((p) => p.value)
				.join('')) ||
			`${a.name}, as implemented in ${a.implementations.map((i) => i.crate).join(', ')}.`
	);
</script>

<svelte:head>
	<title>{a.name} · {SITE_NAME}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE_URL}/algorithms/{a.slug}/" />
	<meta property="og:title" content={a.name} />
	<meta property="og:description" content={description} />
</svelte:head>

<AlgorithmTemplate
	algorithm={a}
	back="{resolve('/algorithms')}#{a.kind}"
	before={a.buildsOn.map((b) => ({
		name: b.name,
		href: b.linked ? href(b.slug) : null,
		relation: b.relation
	}))}
	after={a.builtUponBy.map((b) => ({
		name: b.name,
		href: b.linked ? href(b.slug) : null,
		relation: b.relation
	}))}
	crateHref={(crate, slug) => `${resolve('/crates/[name]', { name: crate })}#algo-${slug}`}
/>
