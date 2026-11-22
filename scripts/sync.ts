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
//   related.json  name, repository and description of the neighbouring crates in RELATED
//
// The crate list is the categories in src/lib/registry.ts. CI runs this before every build.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { posix, relative, resolve } from 'node:path';
import { parse as parseToml } from 'smol-toml';
import { ALGORITHMS } from '../src/lib/algorithms.ts';
import { CATEGORIES, RELATED } from '../src/lib/registry.ts';
import { lint, parseBlocks, type Block } from '../src/lib/richtext.ts';
import {
	absolutize,
	indexPath,
	intro,
	latestOf,
	released,
	repoOf,
	searchText,
	sections,
	type IndexLine,
	type Vcs
} from './sync-parse.ts';

const ROOT = resolve(import.meta.dirname, '..');
const DATA = resolve(ROOT, 'src/lib/data');
const USER_AGENT =
	'planning-and-search-site-sync (+https://sunsided.github.io/planning-and-search/)';

/** Published crates of a workspace that have no page here but are listed on one. */
const SIBLINGS: Record<string, string[]> = {
	'pddl-validate': ['pddl-codegen', 'pddl-core', 'pddl-lsp', 'pddl-macros', 'pddl-runtime']
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

async function get(url: string): Promise<Response> {
	const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	return res;
}

/**
 * Crates to take from a local checkout instead of crates.io, to preview a release before it is
 * published: `node scripts/sync.ts --local <crate dir>[@<version to show>]`, repeatable.
 * `cargo package` builds the same archive crates.io would get, so the sync reads it unchanged.
 * The snapshot it writes is a preview and must not be committed.
 */
const LOCAL = new Map<string, { version: string; crate: Buffer; index: IndexLine }>();
for (const [i, arg] of process.argv.entries()) {
	if (arg !== '--local') continue;
	const [dir, shown] = (process.argv[i + 1] ?? '').split('@');
	if (!dir) throw new Error('--local needs a crate directory');
	const manifest = parseToml(readFileSync(resolve(dir, 'Cargo.toml'), 'utf8')) as Record<
		string,
		any
	>;
	const { name, version } = manifest.package;
	const target = resolve(ROOT, 'node_modules/.cache/sync-local');
	execFileSync(
		'cargo',
		['package', '--no-verify', '--allow-dirty', '--quiet', '--target-dir', target],
		{ cwd: dir, stdio: ['ignore', 'ignore', 'inherit'] }
	);
	const crate = readFileSync(resolve(target, 'package', `${name}-${version}.crate`));
	const packaged = parseToml(member(crate, `${name}-${version}/Cargo.toml`)!) as Record<
		string,
		any
	>;
	LOCAL.set(name, {
		version,
		crate,
		index: {
			vers: shown || version,
			yanked: false,
			rust_version: packaged.package?.['rust-version'],
			deps: depsOf(packaged)
		}
	});
	console.warn(
		`${name}: from ${dir} as ${shown || version} (preview; do not commit src/lib/data/)`
	);
}

/** The index's dependency list, read from a packaged (normalized) Cargo.toml. */
function depsOf(manifest: Record<string, any>): IndexLine['deps'] {
	const kinds = {
		dependencies: 'normal',
		'dev-dependencies': 'dev',
		'build-dependencies': 'build'
	} as const;
	return Object.entries(kinds).flatMap(([table, kind]) =>
		Object.entries(manifest[table] ?? {}).map(([name, spec]: [string, any]) => ({
			name,
			package: typeof spec === 'object' ? spec.package : undefined,
			kind,
			optional: typeof spec === 'object' && spec.optional === true
		}))
	);
}

/** The newest release that is not yanked and not a pre-release. */
async function latest(name: string): Promise<IndexLine> {
	const local = LOCAL.get(name);
	if (local) return local.index;
	const line = latestOf(await (await get(`https://index.crates.io/${indexPath(name)}`)).text());
	if (!line) throw new Error(`${name}: no released version on crates.io`);
	return line;
}

interface Archive {
	manifest: Record<string, any>;
	readme: string | null;
	/** Every .rs file under src/, concatenated: what was released. */
	source: string;
	vcs: Vcs | null;
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
	const local = LOCAL.get(name);
	if (local) return unpack(name, local.version, local.crate);
	const url = `https://static.crates.io/crates/${name}/${name}-${version}.crate`;
	return unpack(name, version, Buffer.from(await (await get(url)).arrayBuffer()));
}

function unpack(name: string, version: string, crate: Buffer): Archive {
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

// Neighbouring crates the overview mentions: metadata only, no page and no edges.
const related = [];
for (const { name } of RELATED) {
	const index = await latest(name);
	const { manifest } = await archive(name, index.vers);
	const pkg = manifest.package ?? {};
	related.push({
		name,
		version: index.vers,
		repo: repoOf(pkg.repository, name),
		description: String(pkg.description ?? '').trim()
	});
	console.log(`${name} ${index.vers} (related)`);
}
writeFileSync(resolve(DATA, 'related.json'), JSON.stringify(related, null, '\t') + '\n');

crates.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(resolve(DATA, 'crates.json'), JSON.stringify(crates, null, '\t') + '\n');
writeFileSync(resolve(DATA, 'readmes.json'), JSON.stringify(readmes, null, '\t') + '\n');
console.log(`${crates.length} crates → src/lib/data/`);
