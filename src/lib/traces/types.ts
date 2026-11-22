// The trace format every visualization uses: a scene that does not change, and frames that
// say what the algorithm knows at each step. The player draws all of them the same way:
// open states, closed states, the state being expanded, and the path once there is one.
//
// Traces come from small re-implementations on fixed toy instances (src/lib/traces/*.ts).
// Issue #1 is about taking them from the crates instead.

/** A 4-connected grid; cells are numbered row-major, `y * width + x`. */
export interface GridScene {
	kind: 'grid';
	width: number;
	height: number;
	walls: number[];
	/** Cells that cost more than 1 to enter (mud), with their cost. */
	costs: [cell: number, cost: number][];
	start: number;
	goal: number;
}

export interface GridFrame {
	open: number[];
	closed: number[];
	current: number | null;
	path: number[];
	note: string;
}

/** A unit square with axis-aligned rectangular obstacles. */
export interface PlaneScene {
	kind: 'plane';
	obstacles: [x: number, y: number, w: number, h: number][];
	start: [number, number];
	goal: [number, number];
	goalRadius: number;
}

export interface PlaneFrame {
	/** Tree nodes; edges are each node to its parent (-1 for the root). */
	nodes: [x: number, y: number, parent: number][];
	sample: [number, number] | null;
	/** Edges rewired in this step, as [child, old parent]. */
	rewired: [number, number][];
	path: number[];
	note: string;
}

export type Trace =
	| { scene: GridScene; frames: GridFrame[]; legend: string }
	| { scene: PlaneScene; frames: PlaneFrame[]; legend: string };
