// Snapshots the published crates into src/lib/data/, which the site builds from.
//
// The source is crates.io, so the site shows what was released, not what is on a branch: the
// sparse index gives the latest version and the dependency edges, and the published .crate
// archive gives the normalized Cargo.toml (description, licence, MSRV, keywords, repository),
// the README and .cargo_vcs_info.json (the commit and the crate's directory in its repository,
// which README-relative links resolve against).
//
// Writes:
//   crates.json   what the pages show: metadata and the README's audience section ("Who this
//                 is for" and its variants), or content/overrides/<crate>.md where a README has
//                 none or says something the site does not
//   readmes.json  the rest of each README as plain text, which search loads on demand as a
//                 lower-confidence signal
//
// The crate list is the categories in src/lib/registry.ts. CI runs this before every build.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { posix, relative, resolve } from 'node:path';
import { parse as parseToml } from 'smol-toml';
import { CATEGORIES } from '../src/lib/registry.ts';
import { lint, parseBlocks, type Block } from '../src/lib/richtext.ts';
import { plain } from '../src/lib/search.ts';

const ROOT = resolve(import.meta.dirname, '..');
const DATA = resolve(ROOT, 'src/lib/data');
const USER_AGENT =
	'planning-and-search-site-sync (+https://sunsided.github.io/planning-and-search/)';

/** Published crates of a workspace that have no page here but are listed on one. */
const SIBLINGS: Record<string, string[]> = {
	'pddl-validate': ['pddl', 'pddl-codegen', 'pddl-core', 'pddl-lsp', 'pddl-macros', 'pddl-runtime']
};

/** The README headings that introduce a crate's audience, across the repositories. */
const AUDIENCE = /^## (Who (this|it) is for|What is this for\?|What it'?s for|What it is for)\s*$/;

/** README sections search leaves out: setup, legal, and anything not released yet. */
const SKIP =
	/^## (Installation|MSRV|Minimum supported Rust version|License|Licence|Contributing|Development|Project Layout|Acknowledgements|Roadmap|Not yet implemented|Tested|Testing|Verification)\b/i;

export interface CrateData {
	name: string;
	version: string;
	repo: string;
	description: string;
	license: string;
	msrv: string | null;
	keywords: string[];
	deps: { name: string; kind: 'normal' | 'optional' | 'dev' }[];
	siblings: { name: string; description: string }[];
	audience: Block[];
	/** Slugs from content/algorithms.json whose implementation in this crate is released. */
	algorithms: string[];
	/** `who`: the README's audience section or an override; `intro`: its opening prose. */
	about: 'who' | 'intro';
}

interface IndexLine {
	vers: string;
	yanked: boolean;
	rust_version?: string | null;
	deps: { name: string; package?: string; kind: 'normal' | 'dev' | 'build'; optional: boolean }[];
}

async function get(url: string): Promise<Response> {
	const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	return res;
}

/** The sparse index's path for a crate name. */
function indexPath(name: string): string {
	const n = name.toLowerCase();
	if (n.length <= 2) return `${n.length}/${n}`;
	if (n.length === 3) return `3/${n[0]}/${n}`;
	return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n}`;
}

/** The newest release that is not yanked and not a pre-release. */
async function latest(name: string): Promise<IndexLine> {
	const lines = (await (await get(`https://index.crates.io/${indexPath(name)}`)).text())
		.trim()
		.split('\n')
		.map((l) => JSON.parse(l) as IndexLine)
		.filter((l) => !l.yanked && !l.vers.includes('-'));
	if (!lines.length) throw new Error(`${name}: no released version on crates.io`);
	return lines.at(-1)!;
}

interface Archive {
	manifest: Record<string, any>;
	readme: string | null;
	/** Every .rs file under src/, concatenated: what was released. */
	source: string;
	vcs: { sha: string; dir: string } | null;
}

/** One file out of a .crate (a gzipped tar), or null when it is not there. */
function member(crate: Buffer, path: string): string | null {
	try {
		return execFileSync('tar', ['-xzO', '-f', '-', path], {
			input: crate,
			encoding: 'utf8',
			stdio: ['pipe', 'pipe', 'ignore'],
			maxBuffer: 16 << 20
		});
	} catch {
		return null;
	}
}

/** Every file in a .crate that matches a glob, concatenated. */
function members(crate: Buffer, glob: string): string {
	try {
		return execFileSync('tar', ['-xzO', '--wildcards', '-f', '-', glob], {
			input: crate,
			encoding: 'utf8',
			stdio: ['pipe', 'pipe', 'ignore'],
			maxBuffer: 256 << 20
		});
	} catch {
		return '';
	}
}

async function archive(name: string, version: string): Promise<Archive> {
	const url = `https://static.crates.io/crates/${name}/${name}-${version}.crate`;
	const crate = Buffer.from(await (await get(url)).arrayBuffer());
	const prefix = `${name}-${version}`;
	const toml = member(crate, `${prefix}/Cargo.toml`);
	if (!toml) throw new Error(`${name} ${version}: archive has no Cargo.toml`);
	const manifest = parseToml(toml) as Record<string, any>;
	const readmePath = manifest.package?.readme;
	const readme =
		typeof readmePath === 'string' ? member(crate, posix.join(prefix, readmePath)) : null;
	const info = member(crate, `${prefix}/.cargo_vcs_info.json`);
	const vcs = info ? JSON.parse(info) : null;
	const source = members(crate, `${prefix}/src/*.rs`);
	return {
		manifest,
		readme,
		source,
		vcs: vcs?.git?.sha1 ? { sha: vcs.git.sha1, dir: vcs.path_in_vcs ?? '' } : null
	};
}

/** `owner/name` from a GitHub repository URL. */
function repoOf(url: unknown, name: string): string {
	const m = typeof url === 'string' && /github\.com\/([^/]+\/[^/#?]+?)(?:\.git)?\/?$/.exec(url);
	if (!m) throw new Error(`${name}: Cargo.toml repository is not a GitHub URL: ${url}`);
	return m[1];
}

/** Turns README-relative links into GitHub links at the released commit. */
function absolutize(md: string, repo: string, vcs: Archive['vcs']): string {
	const ref = vcs?.sha ?? 'HEAD';
	const dir = vcs?.dir ?? '';
	return md.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (_, path: string) => {
		const inRepo = posix.normalize(posix.join(dir, path)).replace(/^\/+/, '');
		return `](https://github.com/${repo}/blob/${ref}/${inRepo})`;
	});
}

/** Splits a README into its `## ` sections: [heading, body]. Text before the first is ''. */
function sections(readme: string): [string, string][] {
	const out: [string, string][] = [['', '']];
	for (const line of readme.split('\n')) {
		if (/^## /.test(line)) out.push([line, '']);
		else out[out.length - 1][1] += line + '\n';
	}
	return out;
}

/** The paragraphs before a README's first section, without its title and badges. */
function intro(md: string): string {
	return md
		.split(/\n\s*\n/)
		.filter((p) => !/^\s*(#|\[!\[|!\[|<|```)/.test(p) && p.trim())
		.join('\n\n');
}

/** README prose for search: no code, tables, HTML, images, or release-schedule wording. */
function searchText(md: string): string {
	const prose = md
		.replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, '')
		.replace(/^\s*\|.*$/gm, '')
		.replace(/<[^>]+>/g, '')
		.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/^#+ /gm, '');
	return prose
		.split(/\n\s*\n/)
		.map(plain)
		.filter((p) => p && !lint(p).length)
		.join(' ');
}

interface Algorithm {
	slug: string;
	name: string;
	aliases: string[];
	implementations: { crate: string; items: string[] }[];
}

const ALGORITHMS: Algorithm[] = JSON.parse(
	readFileSync(resolve(ROOT, 'content/algorithms.json'), 'utf8')
);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whether a public item of that name is in the released source (declared or re-exported). */
function released(source: string, item: string): boolean {
	const name = escape(item.split('::').at(-1)!);
	const declared = new RegExp(
		`\\bpub\\s+(?:(?:async|const|unsafe)\\s+)*(?:fn|struct|enum|type|trait|const|static|mod|union)\\s+${name}\\b`
	);
	const reexported = new RegExp(`\\bpub\\s+use\\s[^;]*\\b${name}\\b`);
	return declared.test(source) || reexported.test(source);
}

/**
 * The algorithms a release implements: every listed item must be public in its source. The
 * curated list may run ahead of a release; what is not released yet stays off the site.
 */
function releasedAlgorithms(name: string, source: string): string[] {
	const out: string[] = [];
	for (const a of ALGORITHMS) {
		const impl = a.implementations.find((i) => i.crate === name);
		if (!impl) continue;
		if (!impl.items.length)
			throw new Error(`content/algorithms.json: ${a.slug} in ${name} names no public item`);
		const ok = impl.items.every((i) => released(source, i));
		if (ok) out.push(a.slug);
		else console.warn(`${name}: ${a.name} is not in the release; left off`);
	}
	return out.sort();
}

const names = CATEGORIES.flatMap((c) => c.crates);
const hub = new Set(names);
const RANK = { normal: 0, optional: 1, dev: 2 } as const;

const crates: CrateData[] = [];
const readmes: Record<string, string> = {};

for (const name of names) {
	const index = await latest(name);
	const { manifest, readme, vcs, source } = await archive(name, index.vers);
	const pkg = manifest.package ?? {};
	if (!pkg.description) throw new Error(`${name}: Cargo.toml has no description`);
	const repo = repoOf(pkg.repository, name);

	const override = resolve(ROOT, 'content/overrides', `${name}.md`);
	const overrideHint = relative(ROOT, override);
	const parts = readme ? sections(absolutize(readme, repo, vcs)) : [];
	const audienceIdx = parts.findIndex(([h]) => AUDIENCE.test(h));

	let md: string;
	let about: CrateData['about'] = 'who';
	if (existsSync(override)) md = readFileSync(override, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
	else if (audienceIdx >= 0) md = parts[audienceIdx][1];
	else {
		// A release from before its README had the section: its opening prose stands in.
		md = intro(parts[0]?.[1] ?? '');
		about = 'intro';
		if (!md) throw new Error(`${name}: README has neither an audience section nor an intro`);
		console.warn(`${name}: no audience section in the release; using its intro`);
	}

	const problems = lint(md);
	if (problems.length)
		throw new Error(
			`${name}: audience text says ${problems.map((p) => `"${p}"`).join(', ')}; ` +
				`write ${overrideHint} without it`
		);

	readmes[name] = parts
		.filter(([h], i) => i !== audienceIdx && !SKIP.test(h))
		.map(([h, body]) => searchText(`${h}\n${body}`))
		.filter(Boolean)
		.join(' ');

	const siblings = [];
	for (const s of SIBLINGS[name] ?? []) {
		const sib = await archive(s, (await latest(s)).vers);
		siblings.push({ name: s, description: String(sib.manifest.package?.description ?? '') });
	}

	// A crate listed twice (say, normal and dev) shows its strongest edge.
	const deps = new Map<string, CrateData['deps'][number]['kind']>();
	for (const d of index.deps) {
		const dep = d.package ?? d.name;
		if (!hub.has(dep) || d.kind === 'build') continue;
		const kind = d.kind === 'dev' ? 'dev' : d.optional ? 'optional' : 'normal';
		if (!deps.has(dep) || RANK[kind] < RANK[deps.get(dep)!]) deps.set(dep, kind);
	}

	crates.push({
		name,
		version: index.vers,
		repo,
		description: String(pkg.description).trim(),
		license: String(pkg.license ?? ''),
		msrv: index.rust_version ?? pkg['rust-version'] ?? null,
		keywords: pkg.keywords ?? [],
		deps: [...deps]
			.map(([n, kind]) => ({ name: n, kind }))
			.sort((a, b) => a.name.localeCompare(b.name)),
		siblings,
		audience: parseBlocks(md),
		algorithms: releasedAlgorithms(name, source),
		about
	});
	console.log(`${name} ${index.vers}`);
}

crates.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(resolve(DATA, 'crates.json'), JSON.stringify(crates, null, '\t') + '\n');
writeFileSync(resolve(DATA, 'readmes.json'), JSON.stringify(readmes, null, '\t') + '\n');
console.log(`${crates.length} crates → src/lib/data/`);
