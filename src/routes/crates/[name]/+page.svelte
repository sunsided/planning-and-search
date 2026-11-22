<script lang="ts">
	import type { CrateRef } from '#lib/components/molecules/CrateRefList.svelte';
	import CrateTemplate from '#lib/components/templates/CrateTemplate.svelte';
	import { categoryOf, crateAt, dependents, type DepKind } from '#lib/registry.js';
	import { SITE_NAME, SITE_URL } from '#lib/site.js';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { crate, category } = $derived(data);

	const NOTES: Record<DepKind, string | undefined> = {
		normal: undefined,
		optional: 'optional',
		dev: 'dev-only' // tests, examples or benches: not needed to use the crate
	};
	const ref = (d: { name: string; kind: string }): CrateRef => ({
		name: d.name,
		href: resolve('/crates/[name]', { name: d.name }),
		hue: categoryOf(d.name)?.hue,
		note: NOTES[d.kind as DepKind]
	});
	// The site's own absolute URLs and the crates' repositories become links within the site.
	const internal = (href: string) => {
		if (href.startsWith(`${SITE_URL}/`)) return resolve('/') + href.slice(SITE_URL.length + 1);
		const name = crateAt(href);
		return name && resolve('/crates/[name]', { name });
	};
	const title = $derived(`${crate.name} · ${SITE_NAME}`);
	const url = $derived(`${SITE_URL}/crates/${crate.name}/`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={crate.description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={crate.name} />
	<meta property="og:description" content={crate.description} />
	<meta property="og:url" content={url} />
</svelte:head>

<CrateTemplate
	{crate}
	{category}
	back="{resolve('/')}#{category.slug}"
	dependencies={crate.deps.map(ref)}
	dependents={dependents(crate.name).map(ref)}
	{internal}
	algorithms={data.algorithms.map((a) => ({
		...a,
		href: resolve('/algorithms/[slug]', { slug: a.slug })
	}))}
/>
