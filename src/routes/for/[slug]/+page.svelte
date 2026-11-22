<script lang="ts">
	import AudienceTemplate from '#lib/components/templates/AudienceTemplate.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/site.js';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const crateHref = (name: string) => resolve('/crates/[name]', { name });
	const view = $derived({
		title: data.audience.title,
		lead: data.audience.lead,
		start: data.start.map((s) => ({ ...s, href: crateHref(s.crate) })),
		crates: data.crates.map((c) => ({ ...c, href: crateHref(c.crate) })),
		algorithms: data.algorithms.map((a) => ({
			name: a.name,
			href: resolve('/algorithms/[slug]', { slug: a.slug })
		}))
	});
	const title = $derived(`For ${data.audience.title}`);
</script>

<svelte:head>
	<title>{title} · {SITE_NAME}</title>
	<meta name="description" content={data.audience.lead} />
	<link rel="canonical" href="{SITE_URL}/for/{data.audience.slug}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.audience.teaser} />
</svelte:head>

<AudienceTemplate {view} back={resolve('/')} />
