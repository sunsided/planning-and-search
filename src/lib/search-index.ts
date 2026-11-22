// The search index: one entry per crate, algorithm and category, with the text each is found
// by. The prerendered /search.json serves it, README text included, to the palette.

import { algorithmsOf } from './algorithms.ts';
import { CATEGORIES, CRATES, categoryOf } from './registry.ts';
import type { Block } from './richtext.ts';
import { plain, type Entry } from './search.ts';

const blocksText = (blocks: Block[]) =>
	blocks.map((b) => (b.kind === 'p' ? b.text : b.items.join(' '))).join(' ');

export interface Hrefs {
	crate: (name: string) => string;
	category: (slug: string) => string;
	algorithm: (slug: string) => string;
}

export function entries(href: Hrefs): Entry[] {
	const crates: Entry[] = CRATES.map((c) => {
		const category = categoryOf(c.name)!;
		const body = plain(blocksText(c.audience as Block[]));
		return {
			kind: 'crate',
			title: c.name,
			subtitle: plain(c.description),
			href: href.crate(c.name),
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
		href: href.category(c.slug),
		hue: c.hue,
		fields: [
			{ text: c.title, weight: 6 },
			{ text: c.blurb, weight: 3 },
			{ text: c.crates.join(' '), weight: 2 }
		].map((f) => ({ ...f, text: f.text.toLowerCase() })),
		body: ''
	}));
	// One entry per algorithm, landing on its page; every implementing crate adds its words.
	const bySlug = new Map<string, { crates: string[]; impls: ReturnType<typeof algorithmsOf> }>();
	for (const c of CRATES)
		for (const a of algorithmsOf(c.name)) {
			const e = bySlug.get(a.slug) ?? { crates: [], impls: [] };
			e.crates.push(c.name);
			e.impls.push(a);
			bySlug.set(a.slug, e);
		}
	const algorithms: Entry[] = [...bySlug].map(([slug, { crates, impls }]) => {
		const a = impls[0];
		return {
			kind: 'algorithm' as const,
			title: a.name,
			subtitle: `${crates.join(', ')} · ${a.summary}`,
			href: href.algorithm(slug),
			hue: categoryOf(crates[0])!.hue,
			fields: [
				{ text: a.name, weight: 8 },
				{ text: a.aliases.join(' '), weight: 7 },
				{ text: impls.flatMap((i) => i.items.map((x) => x.name)).join(' '), weight: 5 },
				{ text: crates.join(' '), weight: 3 },
				{ text: impls.map((i) => i.summary).join(' '), weight: 2 },
				{ text: a.refs.join(' '), weight: 1 }
			].map((f) => ({ ...f, text: f.text.toLowerCase() })),
			body: ''
		};
	});
	return [...crates, ...algorithms, ...categories];
}
