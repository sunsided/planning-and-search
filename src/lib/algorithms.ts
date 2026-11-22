// The curated algorithm list (content/algorithms.json) joined with the releases. Server
// code, the sync's tests and stories use it; pages get only what they show.

import algorithms from '../../content/algorithms.json' with { type: 'json' };
import { crate } from './registry.ts';

export type Algorithm = (typeof algorithms)[number];

/**
 * The curated algorithm list (content/algorithms.json). It may run ahead of the releases;
 * a crate's `algorithms` (from the sync) holds the slugs its release implements.
 */
export const ALGORITHMS: Algorithm[] = algorithms;

/** docs.rs search for an item, which finds it wherever it lives in the crate. */
export const docsItem = (crate: string, item: string) =>
	`https://docs.rs/${crate}/latest/${crate.replaceAll('-', '_')}/?search=${encodeURIComponent(item.split('::').at(-1)!)}`;

/** The released algorithms of a crate, with this crate's implementation of each. */
export function algorithmsOf(name: string) {
	const released = new Set(crate(name)?.algorithms ?? []);
	return ALGORITHMS.filter((a) => released.has(a.slug)).map((a) => {
		const impl = a.implementations.find((i) => i.crate === name)!;
		return {
			slug: a.slug,
			name: a.name,
			aliases: a.aliases,
			kind: a.kind,
			refs: a.refs,
			summary: impl.summary,
			feature: impl.feature,
			items: impl.items.map((i) => ({ name: i, href: docsItem(name, i) }))
		};
	});
}
