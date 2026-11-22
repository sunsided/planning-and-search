// The per-algorithm content beside content/algorithms.json: content/algorithms/<slug>/meta.json
// (what the page says) and pseudocode.txt (in the site's pseudo-language). `check` rejects
// anything outside this shape, so a page never renders half-filled or unverified data.

import { lint } from './richtext.ts';

export interface Paper {
	authors: string;
	title: string;
	year: number;
	venue: string | null;
	/** A DOI that resolved to this title and year when it was added; links to doi.org. */
	doi: string | null;
	/** An arXiv id that resolved to this title; links to arxiv.org. */
	arxiv: string | null;
	/** Any other stable URL (proceedings page, author's PDF), checked when added. */
	url: string | null;
	/** What the paper is for this algorithm. */
	role: 'introduces' | 'extends' | 'analyses' | 'applies' | 'surveys';
}

export interface Lineage {
	/** Another algorithm of this site, or null for one the site does not list. */
	slug: string | null;
	/** Display name when `slug` is null. */
	name: string | null;
	relation: 'builds-on' | 'generalizes' | 'specializes' | 'combines' | 'replaces';
	/** Which of this page's papers (by title) or which crate source states the relation. */
	source: string;
}

export interface Meta {
	/** Two to five sentences: what it does, how, and when to use it. Inline rich text. */
	description: string;
	papers: Paper[];
	lineage: Lineage[];
	/** A key of src/lib/traces TRACES, or null. */
	trace: string | null;
}

const ROLES = ['introduces', 'extends', 'analyses', 'applies', 'surveys'];
const RELATIONS = ['builds-on', 'generalizes', 'specializes', 'combines', 'replaces'];

const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const isOptStr = (v: unknown) => v === null || isStr(v);

export function check(
	slug: string,
	meta: unknown,
	known: { slugs: Set<string>; traces: Set<string> }
): Meta {
	const fail = (what: string): never => {
		throw new Error(`content/algorithms/${slug}/meta.json: ${what}`);
	};
	const m = meta as Meta;
	if (!m || typeof m !== 'object') fail('not an object');
	const keys = Object.keys(m).sort().join(',');
	if (keys !== 'description,lineage,papers,trace') fail(`unexpected keys: ${keys}`);
	if (!isStr(m.description)) fail('description is empty');
	const words = lint(m.description);
	if (words.length) fail(`description says ${words.join(', ')}`);
	if (!Array.isArray(m.papers)) fail('papers is not a list');
	m.papers.forEach((p, i) => {
		const at = `papers[${i}]`;
		const pk = Object.keys(p).sort().join(',');
		if (pk !== 'arxiv,authors,doi,role,title,url,venue,year') fail(`${at}: unexpected keys ${pk}`);
		if (!isStr(p.authors) || !isStr(p.title)) fail(`${at}: authors and title are required`);
		if (!Number.isInteger(p.year) || p.year < 1900 || p.year > 2100) fail(`${at}: bad year`);
		if (!isOptStr(p.venue)) fail(`${at}: venue`);
		if (p.doi !== null && !/^10\.\d{4,9}\/\S+$/.test(p.doi)) fail(`${at}: doi is not a bare DOI`);
		if (p.arxiv !== null && !/^(\d{4}\.\d{4,5}|[a-z-]+(\.[A-Z]{2})?\/\d{7})$/.test(p.arxiv))
			fail(`${at}: arxiv is not an arXiv id`);
		if (p.url !== null && !/^https:\/\/\S+$/.test(p.url)) fail(`${at}: url must be https`);
		if (!ROLES.includes(p.role)) fail(`${at}: role ${p.role}`);
	});
	if (!Array.isArray(m.lineage)) fail('lineage is not a list');
	m.lineage.forEach((l, i) => {
		const at = `lineage[${i}]`;
		const lk = Object.keys(l).sort().join(',');
		if (lk !== 'name,relation,slug,source') fail(`${at}: unexpected keys ${lk}`);
		if ((l.slug === null) === (l.name === null)) fail(`${at}: exactly one of slug and name`);
		if (l.slug !== null && !known.slugs.has(l.slug)) fail(`${at}: unknown slug ${l.slug}`);
		if (l.slug === slug) fail(`${at}: an algorithm cannot build on itself`);
		if (!RELATIONS.includes(l.relation)) fail(`${at}: relation ${l.relation}`);
		if (!isStr(l.source)) fail(`${at}: source is required`);
	});
	if (m.trace !== null && !known.traces.has(m.trace)) fail(`unknown trace ${m.trace}`);
	return m;
}

/** Lineage edges must not loop: A builds on B builds on A. Returns one cycle, or null. */
export function findCycle(edges: Map<string, string[]>): string[] | null {
	const state = new Map<string, 'open' | 'done'>();
	const stack: string[] = [];
	const visit = (n: string): string[] | null => {
		if (state.get(n) === 'done') return null;
		if (state.get(n) === 'open') return [...stack.slice(stack.indexOf(n)), n];
		state.set(n, 'open');
		stack.push(n);
		for (const m of edges.get(n) ?? []) {
			const c = visit(m);
			if (c) return c;
		}
		stack.pop();
		state.set(n, 'done');
		return null;
	};
	for (const n of edges.keys()) {
		const c = visit(n);
		if (c) return c;
	}
	return null;
}
