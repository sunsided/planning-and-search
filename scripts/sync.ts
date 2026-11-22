// Snapshots the planning crates into src/lib/data/crates.json, which the site builds from.
//
// CI has no checkouts of the crate repositories, so this runs locally against them and the
// snapshot is committed. Per crate it takes the hub's list (plan/crates.json: name, repository,
// dependency edges between the crates), the package metadata cargo reports (description,
// licence, MSRV, keywords, workspace siblings) and the README's audience section ("Who this is
// for" and its variants), or content/overrides/<crate>.md where a README has none.
//
//   node scripts/sync.ts                 # crates under ~/dev/mine/rust/planning
//   PLANNING_DIR=/elsewhere node scripts/sync.ts

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { lint, parseBlocks, type Block } from '../src/lib/richtext.ts';

const ROOT = resolve(import.meta.dirname, '..');
const PLANNING = process.env.PLANNING_DIR ?? join(homedir(), 'dev/mine/rust/planning');
const OUT = join(ROOT, 'src/lib/data/crates.json');

/** The README headings that introduce a crate's audience, across the repositories. */
const AUDIENCE = /^## (Who (this|it) is for|What is this for\?|What it'?s for|What it is for)\s*$/;

interface HubCrate {
	name: string;
	repo: string;
	deps: { name: string; kind: 'normal' | 'optional' | 'dev' }[];
}

interface Package {
	name: string;
	version: string;
	description: string | null;
	license: string | null;
	rust_version: string | null;
	keywords: string[];
	readme: string | null;
	manifest_path: string;
	publish: string[] | null;
}

export interface CrateData {
	name: string;
	repo: string;
	description: string;
	license: string;
	msrv: string | null;
	keywords: string[];
	deps: HubCrate['deps'];
	/** Other published crates of the same workspace that are not hub crates themselves. */
	siblings: { name: string; description: string }[];
	audience: Block[];
}

const hub: HubCrate[] = JSON.parse(readFileSync(join(PLANNING, 'plan/crates.json'), 'utf8')).crates;
const names = new Set(hub.map((c) => c.name));

/** The checkout of `owner/name`, by repository name, beside the plan directory. */
const checkout = (repo: string) => join(PLANNING, repo.split('/')[1]);

const metadata = new Map<string, { root: string; packages: Package[] }>();
for (const repo of new Set(hub.map((c) => c.repo))) {
	const dir = checkout(repo);
	const out = execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], {
		cwd: dir,
		encoding: 'utf8',
		maxBuffer: 64 << 20
	});
	const meta = JSON.parse(out);
	metadata.set(repo, { root: meta.workspace_root, packages: meta.packages });
}

/** Turns README-relative links into GitHub links, so they work from the site. */
function absolutize(md: string, repo: string, readmeDir: string, root: string): string {
	return md.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (_, path: string) => {
		const inRepo = relative(root, resolve(readmeDir, path));
		return `](https://github.com/${repo}/blob/main/${inRepo})`;
	});
}

function audienceSection(readme: string): string | null {
	const lines = readme.split('\n');
	const start = lines.findIndex((l) => AUDIENCE.test(l));
	if (start < 0) return null;
	const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
	return lines.slice(start + 1, end < 0 ? undefined : end).join('\n');
}

const crates: CrateData[] = hub.map((c) => {
	const { root, packages } = metadata.get(c.repo)!;
	const pkg = packages.find((p) => p.name === c.name);
	if (!pkg) throw new Error(`${c.name}: no such package in ${c.repo}`);
	if (!pkg.description) throw new Error(`${c.name}: Cargo.toml has no description`);

	const override = join(ROOT, 'content/overrides', `${c.name}.md`);
	let md: string;
	if (existsSync(override)) {
		md = readFileSync(override, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
	} else {
		if (!pkg.readme) throw new Error(`${c.name}: no README and no ${relative(ROOT, override)}`);
		const readmePath = resolve(dirname(pkg.manifest_path), pkg.readme);
		const section = audienceSection(readFileSync(readmePath, 'utf8'));
		if (section === null)
			throw new Error(
				`${c.name}: README has no audience section; write ${relative(ROOT, override)}`
			);
		md = absolutize(section, c.repo, dirname(readmePath), root);
	}

	const audience = parseBlocks(md);
	const problems = lint(md);
	if (problems.length)
		throw new Error(
			`${c.name}: audience text says ${problems.map((p) => `"${p}"`).join(', ')}; ` +
				`write ${relative(ROOT, override)} without it`
		);

	const siblings = packages
		.filter(
			(p) =>
				p.name !== c.name &&
				!names.has(p.name) &&
				p.publish?.length !== 0 &&
				p.version !== '0.0.0' &&
				p.description
		)
		.map((p) => ({ name: p.name, description: p.description! }))
		.sort((a, b) => a.name.localeCompare(b.name));

	return {
		name: c.name,
		repo: c.repo,
		description: pkg.description,
		license: pkg.license ?? '',
		msrv: pkg.rust_version,
		keywords: pkg.keywords,
		deps: c.deps.filter((d) => names.has(d.name)).sort((a, b) => a.name.localeCompare(b.name)),
		siblings,
		audience
	};
});

crates.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(OUT, JSON.stringify(crates, null, '\t') + '\n');
console.log(`${crates.length} crates → ${relative(ROOT, OUT)}`);
