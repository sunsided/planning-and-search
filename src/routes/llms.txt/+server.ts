import { ALGORITHMS } from '#lib/algorithms.js';
import { AUDIENCES } from '#lib/audiences.js';
import { KINDS } from '#lib/kinds.js';
import { RELEASED } from '#lib/server/algorithms.js';
import { CATEGORIES, CRATES, crate, links, relatedCrates } from '#lib/registry.js';
import { plain } from '#lib/search.js';
import { AUTHOR, LINKS, SITE_NAME, SITE_URL } from '#lib/site.js';

// llms.txt (https://llmstxt.org): the site as one Markdown index for language models and
// other tools. Every crate with its links, every algorithm page, the reader guides. Built
// from the same data as the pages, so it is as current as the last sync.
export const prerender = true;

const line = (title: string, url: string, note: string) => `- [${title}](${url}): ${note}`;

export function GET() {
	const out: string[] = [
		`# ${SITE_NAME}`,
		'',
		`> ${CRATES.length} Rust crates by ${AUTHOR} for search and planning: heuristic and multi-objective graph search, classical planning and its heuristics, multi-agent pathfinding and task allocation, planning under uncertainty, adversarial game-tree search, constraint satisfaction, motion planning, reachability, onboard scheduling and PDDL tooling. Each crate is on crates.io with documentation on docs.rs; this site explains which crate does what and every algorithm they implement.`,
		'',
		'Each crate page links to the repository, crates.io and docs.rs, says who the crate is for, and lists its algorithms. Each algorithm page gives a description, pseudocode, the papers that introduced it, its lineage and the crates and public items that implement it. Add any crate below with `cargo add <name>`.',
		''
	];

	out.push('## Guides by reader', '');
	for (const a of AUDIENCES)
		out.push(
			line(
				`For ${a.title}`,
				`${SITE_URL}/for/${a.slug}/`,
				`${a.teaser} Start with ${a.start.map((s) => (s.job ? `${s.crate} (${s.job.toLowerCase()})` : s.crate)).join(', ')}.`
			)
		);
	out.push('');

	for (const c of CATEGORIES) {
		out.push(`## Crates: ${c.title}`, '', c.blurb, '');
		for (const name of c.crates) {
			const k = crate(name);
			if (!k) continue;
			const to = links(k);
			out.push(
				line(
					name,
					`${SITE_URL}/crates/${name}/`,
					`${plain(k.description)}. Docs: ${to.docs} · crates.io: ${to.crates} · source: ${to.repo}`
				)
			);
		}
		out.push('');
	}

	out.push(`## Algorithms`, '', `The index by kind: ${SITE_URL}/algorithms/`, '');
	for (const [kind, title] of Object.entries(KINDS)) {
		const list = RELEASED.filter((a) => a.kind === kind).sort((x, y) =>
			x.name.localeCompare(y.name)
		);
		if (!list.length) continue;
		out.push(`### ${title}`, '');
		for (const a of list) {
			const crates = CRATES.filter((c) => c.algorithms.includes(a.slug)).map((c) => c.name);
			const aliases = ALGORITHMS.find((x) => x.slug === a.slug)?.aliases ?? [];
			out.push(
				line(
					a.name,
					`${SITE_URL}/algorithms/${a.slug}/`,
					`${aliases.length ? `also ${aliases.join(', ')}; ` : ''}in ${crates.join(', ')}`
				)
			);
		}
		out.push('');
	}

	out.push('## Optional', '');
	for (const r of relatedCrates())
		out.push(line(r.name, links(r).crates, `${r.line} (related; not part of the collection)`));
	out.push(
		line('Design system', LINKS.storybook, 'the site’s components and tokens in Storybook'),
		line('Sitemap', `${SITE_URL}/sitemap.xml`, 'every page of the site'),
		''
	);

	return new Response(out.join('\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	});
}
