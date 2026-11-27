// The site's view of the crates: the snapshot `task sync` writes (src/lib/data/crates.json),
// grouped into the categories below. A crate in the snapshot that no category lists, or a
// category entry with no crate behind it, fails the tests.

import data from '#lib/data/crates.json' with { type: 'json' };
import related from '#lib/data/related.json' with { type: 'json' };

export type Crate = (typeof data)[number];
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
			'Searching factored planning tasks: decoupled star-topology search, BDD-based symbolic search, and a small reference planner for PDDL.',
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
		blurb:
			'Many agents at once: collision-free paths on grids and graphs, and who does which task, agreed without a central planner.',
		hue: 60,
		crates: ['mapf-search', 'task-allocation']
	},
	{
		slug: 'uncertainty',
		title: 'Planning under uncertainty',
		blurb: 'Probabilistic outcomes and partial observability: MDPs and POMDPs.',
		hue: 340,
		crates: ['stochastic-search']
	},
	{
		slug: 'game-trees',
		title: 'Game-tree search',
		blurb:
			'Choosing a move when an opponent chooses the next one: minimax, alpha-beta and its successors, expectimax for chance, and Monte Carlo tree search, under a frame budget.',
		hue: 315,
		crates: ['game-tree-search']
	},
	{
		slug: 'constraints',
		title: 'Constraint satisfaction',
		blurb:
			'Small finite domains and the constraints that prune them: puzzles, deduction with hidden information, and small schedules.',
		hue: 40,
		crates: ['constraint-search']
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
		slug: 'quantum',
		title: 'Quantum & QUBO',
		blurb:
			'Planning problems as QUBO and Ising models, for annealers and classical samplers, and quantum search on a simulator, measured in oracle queries.',
		hue: 270,
		crates: ['planning-qubo', 'quantum-planning']
	},
	{
		slug: 'pddl',
		title: 'PDDL tooling',
		blurb: 'Reading PDDL into typed Rust, and checking plans against PDDL domains and problems.',
		hue: 230,
		crates: ['pddl', 'pddl-validate']
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

/**
 * Neighbours of the collection, not part of it: planning decides what to do, these estimate
 * and predict the state it starts from. The overview lists them; they get no page.
 */
export const RELATED: { name: string; line: string }[] = [
	{
		name: 'minikalman',
		line: 'State estimation for microcontrollers: a no_std Kalman filter. It estimates the state that the onboard dispatcher of temporal-control and the checks of resource-timeline act on.'
	},
	{
		name: 'backshift',
		line: 'Time-series forecasting: ARIMA models with a streaming filter that runs without a heap. Use it to forecast the energy or thermal demand that resource-timeline checks against.'
	}
];

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

/**
 * The crate a README link means, when it is a crate's GitHub repository or its directory in a
 * workspace (`…/tree/<ref>/<crate>`). Links into files or to a heading stay on GitHub. A
 * workspace root means the crate named after the repository, with or without `-rs`.
 */
export function crateAt(href: string): string | undefined {
	const m =
		/^https:\/\/github\.com\/([^/#?]+\/[^/#?]+?)\/?(?:\/tree\/[^/#?]+\/([^/#?]+)\/?)?$/.exec(href);
	if (!m) return undefined;
	const [, repo, dir] = m;
	const here = CRATES.filter((c) => c.repo === repo).map((c) => c.name);
	if (dir) return here.find((n) => n === dir);
	const base = repo.split('/')[1];
	return (
		here.find((n) => n === base || `${n}-rs` === base) ?? (here.length === 1 ? here[0] : undefined)
	);
}

export const links = (c: Pick<Crate, 'name' | 'repo'>) => ({
	repo: `https://github.com/${c.repo}`,
	crates: `https://crates.io/crates/${c.name}`,
	docs: `https://docs.rs/${c.name}`
});

/** The related crates with their synced repositories. */
export const relatedCrates = () =>
	RELATED.map((r) => ({ ...r, repo: related.find((x) => x.name === r.name)?.repo ?? '' })).filter(
		(r) => r.repo
	);
