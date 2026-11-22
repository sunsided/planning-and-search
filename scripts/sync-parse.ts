// The pure parts of the sync: what it reads out of the crates.io index, the Cargo manifest, the
// README and the released source. No network and no files, so test/sync.test.ts can run them.

import { posix } from 'node:path';
import { lint } from '../src/lib/richtext.ts';
import { plain } from '../src/lib/search.ts';

export interface IndexLine {
	vers: string;
	yanked: boolean;
	rust_version?: string | null;
	deps: { name: string; package?: string; kind: 'normal' | 'dev' | 'build'; optional: boolean }[];
}

export interface Vcs {
	sha: string;
	dir: string;
}

/** The sparse index's path for a crate name. */
export function indexPath(name: string): string {
	const n = name.toLowerCase();
	if (n.length <= 2) return `${n.length}/${n}`;
	if (n.length === 3) return `3/${n[0]}/${n}`;
	return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n}`;
}

/**
 * The highest release that is not yanked and not a pre-release, or undefined. The index is in
 * publish order, so a backport (0.3.5 after 0.4.0) is last but not latest.
 */
export function latestOf(index: string): IndexLine | undefined {
	return index
		.trim()
		.split('\n')
		.map((l) => JSON.parse(l) as IndexLine)
		.filter((l) => !l.yanked && !l.vers.includes('-'))
		.sort((a, b) => a.vers.localeCompare(b.vers, undefined, { numeric: true }))
		.at(-1);
}

/** `owner/name` from a GitHub repository URL. */
export function repoOf(url: unknown, name: string): string {
	const m = typeof url === 'string' && /github\.com\/([^/]+\/[^/#?]+?)(?:\.git)?\/?$/.exec(url);
	if (!m) throw new Error(`${name}: Cargo.toml repository is not a GitHub URL: ${url}`);
	return m[1];
}

/** Turns README-relative links into GitHub links at the released commit. */
export function absolutize(md: string, repo: string, vcs: Vcs | null): string {
	const ref = vcs?.sha ?? 'HEAD';
	const dir = vcs?.dir ?? '';
	return md.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (_, path: string) => {
		const inRepo = posix.normalize(posix.join(dir, path)).replace(/^\/+/, '');
		return `](https://github.com/${repo}/blob/${ref}/${inRepo})`;
	});
}

/** Splits a README into its `## ` sections: [heading, body]. Text before the first is ''. */
export function sections(readme: string): [string, string][] {
	const out: [string, string][] = [['', '']];
	for (const line of readme.split('\n')) {
		if (/^## /.test(line)) out.push([line, '']);
		else out[out.length - 1][1] += line + '\n';
	}
	return out;
}

/** The paragraphs before a README's first section, without its title and badges. */
export function intro(md: string): string {
	return md
		.split(/\n\s*\n/)
		.filter((p) => !/^\s*(#|\[!\[|!\[|<|```)/.test(p) && p.trim())
		.join('\n\n');
}

/** README prose for search: no code, tables, HTML, images, or release-schedule wording. */
export function searchText(md: string): string {
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

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whether a public item of that name is in the released source (declared or re-exported). */
export function released(source: string, item: string): boolean {
	const name = escape(item.split('::').at(-1)!);
	const declared = new RegExp(
		`\\bpub\\s+(?:(?:async|const|unsafe)\\s+)*(?:fn|struct|enum|type|trait|const|static|mod|union)\\s+${name}\\b`
	);
	const reexported = new RegExp(`\\bpub\\s+use\\s[^;]*\\b${name}\\b`);
	return declared.test(source) || reexported.test(source);
}
