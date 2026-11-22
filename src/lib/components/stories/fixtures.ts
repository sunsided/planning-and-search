// Real crates from the snapshot, so stories show what the site shows.
import type { CrateRef } from '#lib/components/molecules/CrateRefList.svelte';
import { CATEGORIES, categoryOf, crate, type Crate } from '#lib/registry.js';

export const mapf = crate('mapf-search') as Crate;
export const pddl = crate('pddl-validate') as Crate;
export const category = (name: string) => categoryOf(name)!;
export const href = (name: string) => `#${name}`;
export const refs = (names: string[], note?: string): CrateRef[] =>
	names.map((name) => ({ name, href: href(name), hue: categoryOf(name)?.hue, note }));
export const allCategories = CATEGORIES.map((c) => ({
	category: c,
	crates: c.crates.map((n) => crate(n) as Crate)
}));

import { createRawSnippet } from 'svelte';

/** A children snippet of fixed text, for components that take one. */
export const text = (s: string) =>
	createRawSnippet(() => ({ render: () => `<span>${s.replace(/</g, '&lt;')}</span>` }));

import { algorithmsOf } from '#lib/algorithms.js';
import { entries } from '#lib/search-index.js';

/** The site's search entries, linking nowhere. */
export const searchEntries = entries({ crate: href, category: href, algorithm: href });
export const loadSearch = async () => searchEntries;
/** A crate's algorithms as its page lists them. */
export const algorithmItems = (name: string) =>
	algorithmsOf(name).map((a) => ({ ...a, href: href(a.slug) }));
export const go = (href: string) => console.info('go', href);

import aStarListing from '../../../../content/algorithms/a-star/pseudocode.txt?raw';
import aStarMeta from '../../../../content/algorithms/a-star/meta.json';
import { parse as parsePseudo } from '#lib/pseudo.js';
import { TRACES } from '#lib/traces/index.js';

/** The A* pilot page's content, as the server assembles it. */
export const aStar = {
	listing: parsePseudo(aStarListing),
	papers: aStarMeta.papers as import('#lib/algorithm-meta.js').Paper[],
	gridTrace: TRACES['grid/a-star'](),
	planeTrace: TRACES['plane/rrt-star']()
};

import { AUDIENCES } from '#lib/audiences.js';

/** The overview's audience cards, linking nowhere. */
export const audienceCards = AUDIENCES.map((a) => ({
	title: a.title,
	teaser: a.teaser,
	href: '#'
}));
