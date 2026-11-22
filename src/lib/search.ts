// Search over everything the site shows: crates and categories. The corpus is a few dozen
// entries, so it is a linear scan with substring matching and field weights; no index.

import { CATEGORIES, CRATES, algorithmsOf, categoryOf } from './registry.ts';
import type { Block } from './richtext.ts';

export interface Entry {
	kind: 'crate' | 'category' | 'algorithm';
	title: string;
	subtitle: string;
	href: string;
	hue: number;
	/** Searchable text, lowercased, with its weight; earlier fields matter more. */
	fields: { text: string; weight: number }[];
	/** Readable text a snippet is cut from when the match is not in title or subtitle. */
	body: string;
}

export interface Hit {
	entry: Entry;
	score: number;
	/** Context around the first match in the body, when title and subtitle do not explain it. */
	snippet: string | null;
}

/** README prose as plain text: link targets, markup and escapes removed. */
export function plain(md: string): string {
	return md
		.replace(/\]\([^)]*\)/g, ']')
		.replace(/\\(.)/g, '$1')
		.replace(/[`[\]]|\*\*/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

const blocksText = (blocks: Block[]) =>
	blocks.map((b) => (b.kind === 'p' ? b.text : b.items.join(' '))).join(' ');

export function entries(
	crateHref: (name: string) => string,
	categoryHref: (slug: string) => string
): Entry[] {
	const crates: Entry[] = CRATES.map((c) => {
		const category = categoryOf(c.name)!;
		const body = plain(blocksText(c.audience as Block[]));
		return {
			kind: 'crate',
			title: c.name,
			subtitle: plain(c.description),
			href: crateHref(c.name),
			hue: category.hue,
			fields: [
				{ text: c.name, weight: 8 },
				{ text: c.keywords.join(' '), weight: 5 },
				{ text: plain(c.description), weight: 4 },
				{ text: c.siblings.map((s) => s.name).join(' '), weight: 3 },
				{ text: category.title, weight: 2 },
				{ text: body, weight: 1 }
			].map((f) => ({ ...f, text: f.text.toLowerCase() })),
			body
		};
	});
	const categories: Entry[] = CATEGORIES.map((c) => ({
		kind: 'category',
		title: c.title,
		subtitle: c.blurb,
		href: categoryHref(c.slug),
		hue: c.hue,
		fields: [
			{ text: c.title, weight: 6 },
			{ text: c.blurb, weight: 3 },
			{ text: c.crates.join(' '), weight: 2 }
		].map((f) => ({ ...f, text: f.text.toLowerCase() })),
		body: ''
	}));
	// One entry per released implementation: the hit says which crate and lands on it.
	const algorithms: Entry[] = CRATES.flatMap((c) =>
		algorithmsOf(c.name).map((a) => ({
			kind: 'algorithm' as const,
			title: a.name,
			subtitle: `${c.name} · ${a.summary}`,
			href: `${crateHref(c.name)}#algo-${a.slug}`,
			hue: categoryOf(c.name)!.hue,
			fields: [
				{ text: a.name, weight: 8 },
				{ text: a.aliases.join(' '), weight: 7 },
				{ text: a.items.map((i) => i.name).join(' '), weight: 5 },
				{ text: c.name, weight: 3 },
				{ text: a.summary, weight: 2 },
				{ text: a.refs.join(' '), weight: 1 }
			].map((f) => ({ ...f, text: f.text.toLowerCase() })),
			body: ''
		}))
	);
	return [...crates, ...algorithms, ...categories];
}

/** Weight of full-README text: found there, an entry ranks below any page-text match. */
const README_WEIGHT = 0.5;

/**
 * The entries with each crate's full README added as a low-weight field and as snippet text,
 * for when search has loaded readmes.json.
 */
export function withReadmes(all: Entry[], readmes: Record<string, string>): Entry[] {
	return all.map((e) => {
		const readme = e.kind === 'crate' ? readmes[e.title] : undefined;
		if (!readme) return e;
		return {
			...e,
			fields: [...e.fields, { text: readme.toLowerCase(), weight: README_WEIGHT }],
			body: `${e.body} ${readme}`
		};
	});
}

const terms = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean);

/** Whether `term` starts a word in `text` at `at`: a match there counts double. */
const atWordStart = (text: string, at: number) => at === 0 || !/[\p{L}\p{N}]/u.test(text[at - 1]);

function snippet(body: string, term: string, radius = 60): string | null {
	const at = body.toLowerCase().indexOf(term);
	if (at < 0) return null;
	const start = Math.max(0, body.lastIndexOf(' ', Math.max(0, at - radius)) + 1);
	const endSpace = body.indexOf(' ', at + term.length + radius);
	const end = endSpace < 0 ? body.length : endSpace;
	return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
}

/**
 * Every word of the query must occur in some field. An entry scores per word by its best
 * field (weight, doubled at a word start), plus a bonus for an exact title. An empty query
 * lists the crates in name order.
 */
export function search(all: Entry[], query: string): Hit[] {
	const words = terms(query);
	if (!words.length)
		return all
			.filter((e) => e.kind === 'crate')
			.map((entry) => ({ entry, score: 0, snippet: null }));

	const hits: Hit[] = [];
	for (const entry of all) {
		let score = 0;
		for (const w of words) {
			let best = 0;
			for (const f of entry.fields) {
				const at = f.text.indexOf(w);
				if (at >= 0) best = Math.max(best, f.weight * (atWordStart(f.text, at) ? 2 : 1));
			}
			if (!best) {
				score = 0;
				break;
			}
			score += best;
		}
		if (!score) continue;
		if (entry.title.toLowerCase() === query.trim().toLowerCase()) score += 100;
		const shown = `${entry.title} ${entry.subtitle}`.toLowerCase();
		const hidden = words.find((w) => !shown.includes(w));
		hits.push({ entry, score, snippet: hidden ? snippet(entry.body, hidden) : null });
	}
	return hits.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
}
