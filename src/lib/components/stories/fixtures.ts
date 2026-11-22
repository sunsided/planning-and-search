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

import { entries } from '#lib/search.js';

/** The site's search entries, linking nowhere. */
export const searchEntries = entries(href, href);
export const go = (href: string) => console.info('go', href);
