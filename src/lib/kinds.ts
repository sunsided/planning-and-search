/** The algorithm kinds of content/algorithms.json, in the order the index shows them. */
export const KINDS: Record<string, string> = {
	search: 'Search',
	adversarial: 'Game-tree search',
	constraint: 'Constraint satisfaction',
	allocation: 'Task allocation',
	heuristic: 'Heuristics',
	abstraction: 'Abstractions',
	pruning: 'Pruning',
	sampling: 'Sampling-based planning',
	optimization: 'Optimization',
	routing: 'Routing',
	reachability: 'Reachability',
	scheduling: 'Scheduling',
	validation: 'Validation and checking',
	other: 'Other techniques'
};
