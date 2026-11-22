// The site's view of the crates: the snapshot `task sync` writes (src/lib/data/crates.json),
// grouped into the categories below. A crate in the snapshot that no category lists, or a
// category entry with no crate behind it, fails the tests.

import data from '#lib/data/crates.json' with { type: 'json' };
import algorithms from '../../content/algorithms.json' with { type: 'json' };

export type Crate = (typeof data)[number];
export type Algorithm = (typeof algorithms)[number];
export type DepKind = 'normal' | 'optional' | 'dev';

export interface Category {
	slug: string;
	title: string;
	blurb: string;
	/** Hue (oklch degrees) of the category's accent. */
	hue: number;
	crates: string[];
}

export const CATEGORIES: Category[] = [
	{
		slug: 'graph-search',
		title: 'Graph search',
		blurb:
			'Paths through explicit graphs and generated state spaces: heuristic, multi-objective and width-based search.',
		hue: 205,
		crates: ['heuristic-search', 'multiobjective-search', 'width-search']
	},
	{
		slug: 'classical-search',
		title: 'Classical planning: search',
		blurb:
			'Searching factored planning tasks: decoupled star-topology search, BDD-based symbolic search, and a PDDL planner.',
		hue: 155,
		crates: ['decoupled-search', 'symbolic-search', 'miniplan']
	},
	{
		slug: 'classical-heuristics',
		title: 'Classical planning: heuristics',
		blurb:
			'Estimates that guide the search: delete relaxation, landmarks, merge-and-shrink abstractions and cost partitioning.',
		hue: 120,
		crates: ['planning-heuristics', 'merge-and-shrink', 'cost-partition']
	},
	{
		slug: 'multi-agent',
		title: 'Multi-agent',
		blurb: 'Collision-free paths for many agents at once, on grids and graphs.',
		hue: 60,
		crates: ['mapf-search']
	},
	{
		slug: 'uncertainty',
		title: 'Planning under uncertainty',
		blurb: 'Probabilistic outcomes and partial observability: MDPs and POMDPs.',
		hue: 340,
		crates: ['stochastic-search']
	},
	{
		slug: 'motion',
		title: 'Motion planning',
		blurb:
			'Paths and trajectories through continuous space: sampling-based, robust under bounded uncertainty, and evolutionary.',
		hue: 25,
		crates: ['sampling-planning', 'robust-planning', 'evolutionary-planning']
	},
	{
		slug: 'reachability',
		title: 'Reachability',
		blurb:
			'Where a system could possibly end up: set-based reachability with sparse polynomial zonotopes.',
		hue: 295,
		crates: ['polyzonotope', 'polyzonotope-reach']
	},
	{
		slug: 'scheduling',
		title: 'Scheduling',
		blurb:
			'Onboard execution: temporal networks with uncertainty and resource timelines for energy, memory, thermal and communication budgets.',
		hue: 85,
		crates: ['temporal-control', 'resource-timeline']
	},
	{
		slug: 'diagrams',
		title: 'Diagrams',
		blurb: 'Routing many orthogonal connectors through a diagram or schematic at once.',
		hue: 180,
		crates: ['connector-routing']
	},
	{
		slug: 'pddl',
		title: 'PDDL tooling',
		blurb: 'Checking plans against PDDL domains and problems.',
		hue: 230,
		crates: ['pddl-validate']
	},
	{
		slug: 'foundations',
		title: 'Foundations',
		blurb:
			'The shared vocabulary: cost, heuristic, goal and budget traits, and SAS+ planning tasks in the Fast Downward format.',
		hue: 255,
		crates: ['search-core', 'sas-plus']
	}
];

export const CRATES: Crate[] = data;

export function crate(name: string): Crate | undefined {
	return CRATES.find((c) => c.name === name);
}

export function categoryOf(name: string): Category | undefined {
	return CATEGORIES.find((c) => c.crates.includes(name));
}

/** The hub crates that depend on `name`, with the kind of each edge. */
export function dependents(name: string): { name: string; kind: DepKind }[] {
	return CRATES.flatMap((c) =>
		c.deps.filter((d) => d.name === name).map((d) => ({ name: c.name, kind: d.kind as DepKind }))
	);
}

export const links = (c: Pick<Crate, 'name' | 'repo'>) => ({
	repo: `https://github.com/${c.repo}`,
	crates: `https://crates.io/crates/${c.name}`,
	docs: `https://docs.rs/${c.name}`
});

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
