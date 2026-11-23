// The README prose the site shows, parsed into parts instead of rendered as HTML, so it never
// needs escaping and can never inject markup. Understood: paragraphs and `-` lists; inline
// `code`, [text](https://…) links, **strong**, *emphasis* and backslash escapes. Only https
// links are recognised; anything else stays text.

export type Part =
	| { kind: 'text' | 'code' | 'strong' | 'em' | 'sup' | 'sub'; value: string }
	| { kind: 'link'; value: string; href: string; code: boolean };

export type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

const TOKEN =
	/\\([\\`*_{}[\]()#+\-.!|<>])|`([^`]*)`|\[([^\]]+)\]\((https:\/\/[^)\s]+)\)|\*\*(.+?)\*\*|(?<![\w\\])\*(?!\s)((?:\\\*|[^*])+?)(?<![\s\\])\*/g;

/**
 * Scripts as the literature writes them: a single-letter base followed by `^x` or `_x` (or
 * `^{…}`, `_{…}` for longer ones) is a superscript or subscript, so `h^max` reads as h with
 * "max" raised and `h_Ξ` with "Ξ" lowered. A base inside a longer word (`ol_rp`) is left alone.
 */
const SCRIPT = /(?<![\p{L}\p{N}_])(\p{L})([\^_])(?:\{([^}]+)\}|([\p{L}\p{N}][\p{L}\p{N}+*-]*))/gu;

/** Text with its super- and subscripts split out. */
export function notation(text: string): Part[] {
	const out: Part[] = [];
	let at = 0;
	for (const m of text.matchAll(SCRIPT)) {
		const end = m.index + 1;
		if (end > at) out.push({ kind: 'text', value: text.slice(at, end) });
		out.push({ kind: m[2] === '^' ? 'sup' : 'sub', value: m[3] ?? m[4] });
		at = m.index + m[0].length;
	}
	if (at < text.length) out.push({ kind: 'text', value: text.slice(at) });
	return out;
}

/** The ASCII spellings people search for: `h^max`, `h_max` and `hmax` for h^max. */
export function spellings(text: string): string[] {
	const bare = text.replace(SCRIPT, (_, b, __, g, w) => `${b}${g ?? w}`);
	const caret = text.replace(SCRIPT, (_, b, __, g, w) => `${b}^${g ?? w}`);
	const under = text.replace(SCRIPT, (_, b, __, g, w) => `${b}_${g ?? w}`);
	return [...new Set([text, bare, caret, under])];
}

const unescape = (s: string) => s.replace(/\\([\\`*_{}[\]()#+\-.!|<>])/g, '$1');

export function parse(text: string): Part[] {
	const out: Part[] = [];
	let at = 0;
	const push = (kind: 'text', value: string) => {
		const last = out.at(-1);
		if (last?.kind === kind) last.value += value;
		else out.push({ kind, value });
	};
	for (const m of text.matchAll(TOKEN)) {
		if (m.index > at) push('text', text.slice(at, m.index));
		if (m[1] !== undefined) push('text', m[1]);
		else if (m[2] !== undefined) out.push({ kind: 'code', value: m[2] });
		else if (m[3] !== undefined) {
			const code = /^`[^`]+`$/.test(m[3]);
			out.push({
				kind: 'link',
				value: code ? m[3].slice(1, -1) : unescape(m[3]),
				href: m[4],
				code
			});
		} else if (m[5] !== undefined) out.push({ kind: 'strong', value: unescape(m[5]) });
		else out.push({ kind: 'em', value: unescape(m[6]) });
		at = m.index + m[0].length;
	}
	if (at < text.length) push('text', text.slice(at));
	// Super- and subscripts only in running text: code and link targets keep their spelling.
	return out.flatMap((p) => (p.kind === 'text' ? notation(p.value) : [p]));
}

/** Paragraphs and flat `-` lists; continuation lines join the line they continue. */
export function parseBlocks(md: string): Block[] {
	const blocks: Block[] = [];
	let open: Block | null = null;
	for (const raw of md.split('\n')) {
		const line = raw.trim();
		const item = /^[-*] (.*)$/.exec(raw);
		if (!line) open = null;
		else if (item) {
			if (open?.kind !== 'ul') blocks.push((open = { kind: 'ul', items: [] }));
			open.items.push(item[1].trim());
		} else if (open?.kind === 'ul') open.items[open.items.length - 1] += ' ' + line;
		else if (open?.kind === 'p') open.text += ' ' + line;
		else blocks.push((open = { kind: 'p', text: line }));
	}
	return blocks;
}

/** Wording the site never shows: everything reads as it does on release day. A roadmap graph
 * or a probabilistic roadmap is motion planning, not a schedule. */
const BANNED =
	/\b((?<!probabilistic\s+)roadmaps?(?!\s+graph)|not yet|pre-release|work in progress|WIP|TODO|placeholder|coming soon|API may change|milestone|(?:is|are) planned)\b|\(planned\)/gi;

export function lint(text: string): string[] {
	return [...new Set([...text.matchAll(BANNED)].map((m) => m[0]))];
}
