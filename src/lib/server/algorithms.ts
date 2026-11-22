// Algorithm pages, assembled at build time: the curated list (content/algorithms.json), the
// released implementations (the sync's crates.json), the per-algorithm content
// (content/algorithms/<slug>/), the pseudocode parsed and the trace run. Only the server
// reads this; pages get exactly what they show.

import { check, findCycle, type Meta } from '#lib/algorithm-meta.js';
import { parse, type Line } from '#lib/pseudo.js';
import { ALGORITHMS, docsItem, type Algorithm } from '#lib/algorithms.js';
import { CRATES, categoryOf } from '#lib/registry.js';
import { TRACES, type Trace } from '#lib/traces/index.js';

const metas = import.meta.glob('/content/algorithms/*/meta.json', {
	eager: true,
	import: 'default'
});
const listings = import.meta.glob('/content/algorithms/*/pseudocode.txt', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const slugOf = (path: string) => path.split('/').at(-2)!;

/** Algorithms with at least one released implementation: the ones that get a page. */
export const RELEASED: Algorithm[] = ALGORITHMS.filter((a) =>
	CRATES.some((c) => c.algorithms.includes(a.slug))
);
const released = new Set(RELEASED.map((a) => a.slug));
const known = {
	slugs: new Set(ALGORITHMS.map((a) => a.slug)),
	traces: new Set(Object.keys(TRACES))
};

const META = new Map<string, Meta>(
	Object.entries(metas).map(([path, m]) => [slugOf(path), check(slugOf(path), m, known)])
);
const PSEUDO = new Map<string, Line[]>(
	Object.entries(listings).map(([path, text]) => [slugOf(path), parse(text as string, path)])
);
{
	const cycle = findCycle(
		new Map([...META].map(([s, m]) => [s, m.lineage.flatMap((l) => (l.slug ? [l.slug] : []))]))
	);
	if (cycle) throw new Error(`algorithm lineage loops: ${cycle.join(' → ')}`);
}

export interface Relative {
	slug: string | null;
	name: string;
	relation: string;
	/** A page to link to; null when the algorithm has no released page here. */
	linked: boolean;
}

export interface AlgorithmPage {
	slug: string;
	name: string;
	aliases: string[];
	kind: string;
	hue: number;
	description: string | null;
	refs: string[];
	papers: Meta['papers'];
	buildsOn: Relative[];
	builtUponBy: Relative[];
	pseudocode: Line[] | null;
	trace: Trace | null;
	implementations: {
		crate: string;
		summary: string;
		feature: string | null;
		items: { name: string; href: string }[];
	}[];
}

const nameOf = (slug: string) => ALGORITHMS.find((a) => a.slug === slug)?.name ?? slug;

export function algorithmPage(slug: string): AlgorithmPage | null {
	const a = RELEASED.find((x) => x.slug === slug);
	if (!a) return null;
	const meta = META.get(slug);
	const impls = a.implementations.filter((i) =>
		CRATES.find((c) => c.name === i.crate)?.algorithms.includes(slug)
	);
	const builtUponBy: Relative[] = [];
	for (const [other, m] of META)
		for (const l of m.lineage)
			if (l.slug === slug)
				builtUponBy.push({
					slug: other,
					name: nameOf(other),
					relation: l.relation,
					linked: released.has(other)
				});
	return {
		slug,
		name: a.name,
		aliases: a.aliases,
		kind: a.kind,
		hue: categoryOf(impls[0].crate)!.hue,
		description: meta?.description ?? null,
		refs: a.refs,
		papers: meta?.papers ?? [],
		buildsOn: (meta?.lineage ?? []).map((l) => ({
			slug: l.slug,
			name: l.slug ? nameOf(l.slug) : l.name!,
			relation: l.relation,
			linked: l.slug !== null && released.has(l.slug)
		})),
		builtUponBy: builtUponBy.sort((x, y) => x.name.localeCompare(y.name)),
		pseudocode: PSEUDO.get(slug) ?? null,
		trace: meta?.trace ? TRACES[meta.trace]() : null,
		implementations: impls.map((i) => ({
			crate: i.crate,
			summary: i.summary,
			feature: i.feature,
			items: i.items.map((n) => ({ name: n, href: docsItem(i.crate, n) }))
		}))
	};
}
