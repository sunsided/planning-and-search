// "For …" views: one per group of readers, each a short path into the crates. The reasons
// come from the crates' own "Who this is for" sections. The copy follows ASD-STE100 in spirit
// (short sentences, active voice, one idea each, terms explained) and keeps the technical
// detail, so that a hobbyist and a seasoned engineer can both use it.

export interface Pick {
	crate: string;
	why: string;
}

export interface Audience {
	slug: string;
	/** Completes "For …". */
	title: string;
	/** One line for the overview card. */
	teaser: string;
	/** Two to four sentences: the problems this group has, and how the crates help. */
	lead: string;
	/**
	 * Where to begin: one crate, or one per job when the readers come with different problems
	 * (a game needs paths, an opponent or a puzzle). With several, each names its `job`.
	 */
	start: (Pick & { first: string; job?: string })[];
	crates: Pick[];
	/** Algorithm slugs worth reading first. */
	algorithms: string[];
}

export const AUDIENCES: Audience[] = [
	{
		slug: 'robotics',
		title: 'robotics engineers',
		teaser: 'Paths for arms, mobile bases and fleets, safe under uncertainty.',
		lead: 'A robot must move through a continuous space without collisions. Its model is never exact, and other robots share the floor. These crates plan the motion, prove it safe for every state the robot could be in, and coordinate many robots at once.',
		start: [
			{
				crate: 'sampling-planning',
				why: 'It plans paths for arms, mobile bases and car-like vehicles through a continuous space. You bring the collision checker.',
				first:
					'Start with RRT-Connect for a fast first path, then RRT* or BIT* when the path must be short.'
			}
		],
		crates: [
			{
				crate: 'robust-planning',
				why: 'Plans paths that are safe for the whole tube of states around them, when the dynamics have bounded noise.'
			},
			{
				crate: 'polyzonotope-reach',
				why: 'Computes every state a linear or nonlinear system can reach, so you can check a motion against obstacles.'
			},
			{
				crate: 'mapf-search',
				why: 'Moves fleets of mobile robots or AGVs on a grid or a roadmap graph to their goals without collisions.'
			},
			{
				crate: 'stochastic-search',
				why: 'Gives a policy when actions have uncertain outcomes, or when the robot acts on noisy sensor readings.'
			},
			{
				crate: 'evolutionary-planning',
				why: 'Optimises trajectories or motion parameters when the objective is a black box or a simulation.'
			},
			{
				crate: 'heuristic-search',
				why: 'Finds paths on grids and graphs, for example a robot on an occupancy grid.'
			}
		],
		algorithms: ['rrt-connect', 'rrt-star', 'bit-star', 'robust-rrt-star', 'cbs', 'pomcp']
	},
	{
		slug: 'spaceflight',
		title: 'flight software and mission engineers',
		teaser: 'Timelines and schedules that hold up before uplink and onboard.',
		lead: 'A spacecraft or rover runs activities whose durations are uncertain, on limited energy, memory and communication windows. These crates check a schedule before uplink, execute it onboard without a heap, and explain a violation instead of a bare "infeasible".',
		start: [
			{
				crate: 'temporal-control',
				why: 'Checks that a plan with uncertain durations stays executable, and runs it onboard with a no_std, no-alloc dispatcher.',
				first:
					'Model the plan as a simple temporal network with uncertainty (STNU) and check its dynamic controllability first.'
			}
		],
		crates: [
			{
				crate: 'resource-timeline',
				why: 'Checks battery, memory, data volume, instruments and comm windows over time, and explains each violation.'
			},
			{
				crate: 'robust-planning',
				why: 'Plans paths that stay safe under bounded noise, for drones, autonomous vehicles and spacecraft.'
			},
			{
				crate: 'polyzonotope-reach',
				why: 'Bounds every state a system can reach when its initial state and inputs are uncertain.'
			}
		],
		algorithms: [
			'morris-2014-backpropagation',
			'rul-minus',
			'mindispestnu',
			'earliest-start-search',
			'resource-envelopes'
		]
	},
	{
		slug: 'games',
		title: 'game developers',
		teaser: 'Pathfinding, unit groups, opponents and puzzles on a frame budget.',
		lead: 'Games need paths for characters on a grid, groups of units in tight corridors, opponents that look ahead, and puzzles with one solution. They must stay inside a frame budget. These crates give each search an explicit budget and allocation-free variants where it matters.',
		start: [
			{
				job: 'Characters that move',
				crate: 'heuristic-search',
				why: 'Finds paths for a character on a grid or any graph you describe with one small trait.',
				first:
					'Start with A* and a Manhattan or octile heuristic; on open 8-connected grids, try Jump Point Search.'
			},
			{
				job: 'An opponent that looks ahead',
				crate: 'game-tree-search',
				why: 'Gives a computer opponent for board, card and turn-based games, within a node or time budget.',
				first:
					'Describe positions, moves and an evaluation, then deepen alpha-beta until the budget runs out.'
			},
			{
				job: 'Puzzles with one solution',
				crate: 'constraint-search',
				why: 'Generates and checks logic puzzles, gives human-style hints, and grades a puzzle by the techniques it needs.',
				first:
					'Model the grid as variables with all-different groups, then count solutions with a limit of 2.'
			}
		],
		crates: [
			{
				crate: 'mapf-search',
				why: 'Moves groups of units through tight corridors, where independent A* per unit deadlocks or collides.'
			},
			{
				crate: 'evolutionary-planning',
				why: 'Plans with rolling-horizon evolution over your own forward model.'
			},
			{
				crate: 'stochastic-search',
				why: 'Lets an agent act on noisy observations with POMCP or DESPOT, and reuses the search tree between decisions.'
			},
			{
				crate: 'resource-timeline',
				why: 'Tracks stamina, ammunition, storage or build capacity over game ticks, as in colony and strategy games.'
			},
			{
				crate: 'width-search',
				why: 'Searches without a heuristic, from state features alone, as in planning and game benchmarks.'
			}
		],
		algorithms: [
			'a-star',
			'jump-point-search',
			'theta-star',
			'cbs',
			'pibt',
			'rhea',
			'alpha-beta-pruning',
			'iterative-deepening-alpha-beta',
			'monte-carlo-tree-search'
		]
	},
	{
		slug: 'ai-planning',
		title: 'AI planning researchers and planner authors',
		teaser: 'Heuristics, abstractions and searches over SAS+ and PDDL.',
		lead: 'Classical planning needs a task model, heuristics, abstractions and a search that combines them. These crates share one SAS+ task representation and read Fast Downward output. You can compare and combine them without porting C++, and check every plan independently.',
		start: [
			{
				crate: 'sas-plus',
				why: 'Gives the SAS+ task model, transition systems and abstractions that the other planning crates build on.',
				first:
					'Read a Fast Downward translator file into a Task, then try a heuristic from planning-heuristics with A*.'
			}
		],
		crates: [
			{
				crate: 'planning-heuristics',
				why: 'Gives h_FF, red-black planning, landmarks, LM-cut and landmark cost partitioning on one task model.'
			},
			{
				crate: 'merge-and-shrink',
				why: 'Builds abstraction heuristics over all variables of a task at once.'
			},
			{
				crate: 'cost-partition',
				why: 'Adds several abstraction heuristics admissibly with saturated cost partitioning.'
			},
			{
				crate: 'decoupled-search',
				why: 'Searches star-topology factorings, for tasks with a center and many weakly interacting leaves.'
			},
			{
				crate: 'symbolic-search',
				why: 'Searches with BDDs for optimal plans, or proves that no plan exists, on very large state spaces.'
			},
			{
				crate: 'width-search',
				why: 'Gives width-based search (IW, SIW, BFWS) with an adapter for SAS+ tasks.'
			},
			{
				crate: 'pddl',
				why: 'Parses PDDL 3.1 into strongly typed Rust, and grounds a task into SAS+ with its sas-plus feature.'
			},
			{
				crate: 'miniplan',
				why: 'A small reference planner: it plans directly from PDDL, as a library or as a command line tool.'
			},
			{
				crate: 'pddl-validate',
				why: 'Validates plans independently of any planner, with precise diagnostics.'
			}
		],
		algorithms: [
			'h-ff',
			'lm-cut',
			'merge-and-shrink',
			'saturated-cost-partitioning',
			'symba-star',
			'bfws'
		]
	},
	{
		slug: 'routing',
		title: 'route planning and logistics',
		teaser: 'Shortest paths, trade-offs between costs, and fleets on a map.',
		lead: 'A route often has more than one cost: time, distance, price, risk. One "best" route hides the trade-off. These crates find shortest paths, compute the full set of best trade-offs (the Pareto front), and coordinate many vehicles.',
		start: [
			{
				crate: 'multiobjective-search',
				why: 'Shows the trade-off between two or more costs on road networks or grids, exactly or within a guaranteed factor.',
				first: 'For two costs, start with BOA*; for a quick approximate front, use BOA*ε or A*pex.'
			}
		],
		crates: [
			{
				crate: 'heuristic-search',
				why: 'Finds a single cheapest path when there is only one cost, faster and simpler.'
			},
			{
				crate: 'mapf-search',
				why: 'Plans collision-free routes for fleets of robots or AGVs in a warehouse.'
			},
			{
				crate: 'evolutionary-planning',
				why: 'Gives a Pareto front with NSGA-II, NSGA-III or MOEA/D when the costs come from a simulation.'
			}
		],
		algorithms: ['boa-star', 'namoa-star-dr', 'a-star-pex', 'dijkstras-algorithm', 'mo-cbs']
	},
	{
		slug: 'diagrams',
		title: 'diagram and EDA tool builders',
		teaser: 'Connectors that avoid boxes, bend rarely and do not overlap.',
		lead: 'In a diagram, connectors must avoid the boxes, bend rarely, cross rarely and not lie on top of each other. They should also update when a user drags a box. One crate routes all connectors together and separates them exactly.',
		start: [
			{
				crate: 'connector-routing',
				why: 'Routes many orthogonal connectors at once with bend, length and crossing costs, then nudges them apart.',
				first:
					'Build a scene from your boxes and ports, route all connectors, then nudge the result.'
			}
		],
		crates: [
			{
				crate: 'heuristic-search',
				why: 'Gives the plain shortest path on a general graph, when you need only that.'
			}
		],
		algorithms: [
			'orthogonal-visibility-graph',
			'pathfinder',
			'rip-up-and-reroute',
			'nudging',
			'vpsc'
		]
	},
	{
		slug: 'learners',
		title: 'students and the curious',
		teaser: 'See the classic algorithms run, read them, then use them.',
		lead: 'You want to know how a route planner or a game AI finds its way. Start with the algorithm pages: each shows the algorithm run step by step, gives its pseudocode, and names the paper that introduced it. Then use the crate that implements it.',
		start: [
			{
				crate: 'heuristic-search',
				why: 'Implements the classic graph searches behind one interface, so you can compare them on the same problem.',
				first:
					"Read Dijkstra's algorithm, then A*, and see how the estimate h changes the order of expansion."
			}
		],
		crates: [
			{
				crate: 'sampling-planning',
				why: 'Shows how robots plan in continuous space, and its example draws eleven planners on one world.'
			},
			{
				crate: 'stochastic-search',
				why: 'Lets you compare the MDP heuristic search algorithms on the same problems.'
			},
			{
				crate: 'mapf-search',
				why: 'Lets you switch the improvements of CBS on and off one at a time.'
			}
		],
		algorithms: [
			'breadth-first-search',
			'dijkstras-algorithm',
			'a-star',
			'greedy-best-first-search',
			'rrt',
			'rrt-star'
		]
	},
	{
		slug: 'library-authors',
		title: 'authors of search libraries',
		teaser: 'Shared traits so your algorithms work with everyone else’s.',
		lead: 'A new search crate usually defines its own heuristic, goal and budget traits. Then no heuristic works across crates. One small crate gives the shared traits and exact cost types, so a heuristic written once works with every algorithm.',
		start: [
			{
				crate: 'search-core',
				why: 'Gives the shared cost, heuristic, goal and budget traits, with exact no_std cost types.',
				first:
					'Accept the shared Heuristic and Goal traits in your algorithms, and a Budget for every search.'
			}
		],
		crates: [
			{
				crate: 'sas-plus',
				why: 'Gives a shared SAS+ task model, if your algorithms work on planning tasks.'
			}
		],
		algorithms: []
	}
];

export const audience = (slug: string) => AUDIENCES.find((a) => a.slug === slug);
