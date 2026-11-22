<script lang="ts">
	import HomeTemplate from '#lib/components/templates/HomeTemplate.svelte';
	import { AUDIENCES } from '#lib/audiences.js';
	import { CATEGORIES, crate, relatedCrates, type Crate } from '#lib/registry.js';
	import { SITE_NAME, SITE_URL } from '#lib/site.js';
	import { resolve } from '$app/paths';

	const categories = CATEGORIES.map((category) => ({
		category,
		crates: category.crates.map((n) => crate(n)).filter((c): c is Crate => !!c)
	}));
	const description =
		'Rust crates for heuristic search, classical planning, multi-agent pathfinding and task allocation, planning under uncertainty, game-tree search, constraint satisfaction, motion planning, reachability and scheduling.';
</script>

<svelte:head>
	<title>{SITE_NAME}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE_URL}/" />
	<meta property="og:title" content={SITE_NAME} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{SITE_URL}/" />
</svelte:head>

<HomeTemplate
	{categories}
	crateHref={(name) => resolve('/crates/[name]', { name })}
	audiences={AUDIENCES.map((a) => ({
		title: a.title,
		teaser: a.teaser,
		href: resolve('/for/[slug]', { slug: a.slug })
	}))}
	related={relatedCrates()}
/>
