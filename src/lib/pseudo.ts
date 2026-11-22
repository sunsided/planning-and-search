// The site's pseudo-language (content/algorithms/PSEUDOCODE.md): a strict, line-based
// notation. `parse` returns the lines as tokens for rendering, or throws on the first line
// that leaves the notation, so a listing either reads like all the others or fails the build.

export type TokenKind =
	'keyword' | 'name' | 'routine' | 'set' | 'number' | 'symbol' | 'comment' | 'text' | 'string';
export interface Token {
	kind: TokenKind;
	value: string;
}
export interface Line {
	depth: number;
	tokens: Token[];
}

export const KEYWORDS = new Set(
	'algorithm procedure function input output if then else while do for each in repeat until return yield break continue skip and or not true false nil failure error parallel'.split(
		' '
	)
);

const FORBIDDEN: [RegExp, string][] = [
	[/:=/, '":=" (write ←)'],
	[/==|!=|<=|>=/, 'an ASCII comparison (write = ≠ ≤ ≥)'],
	[/&&|\|\|/, '"&&" or "||" (write and, or)'],
	[/\/\/|(^|\s)#/, 'a code comment (write ▷)'],
	[/\{\s*$|^\s*\}\s*$/, 'a brace block (blocks are indentation)'],
	[/^\s*(end|endif|endwhile|endfor|fi|done)\b/, 'an "end" line (blocks are indentation)'],
	[/\t/, 'a tab (indent with two spaces)']
];

const HEADER = /^(algorithm|procedure|function) \S.*\(.*\)$/;

/** How a code line may start or end; anything else is a statement. */
function opensBlock(code: string): boolean {
	return (
		/^(if|else if) .+ then$/.test(code) ||
		/^else$/.test(code) ||
		/^while .+ do$/.test(code) ||
		/^for (each )?.+ do$/.test(code) ||
		/^repeat$/.test(code) ||
		/^in parallel do$/.test(code) ||
		HEADER.test(code)
	);
}

const TOKEN =
	/(▷.*$)|("[^"]*")|([A-Za-zͰ-Ͽ][\wͰ-Ͽ₀-₉′″*-]*(?:\([^)]*\))?)|(\d+(?:\.\d+)?)|(\s+)|(.)/gu;

function tokenize(code: string): Token[] {
	const out: Token[] = [];
	for (const m of code.matchAll(TOKEN)) {
		const [all, comment, string, word, number, space] = m;
		if (comment) out.push({ kind: 'comment', value: comment });
		else if (string) out.push({ kind: 'string', value: string });
		else if (word) {
			// A word followed by "(" is a routine call or header name; the parenthesis is not
			// part of the word, so split it back off.
			const call = /^([^(]+)(\(.*\))$/.exec(word);
			const head = call ? call[1] : word;
			if (KEYWORDS.has(head)) out.push({ kind: 'keyword', value: head });
			else if (call) out.push({ kind: 'routine', value: head });
			else if (/^[A-Z][A-Z0-9_-]+$/.test(head)) out.push({ kind: 'set', value: head });
			else out.push({ kind: 'name', value: head });
			if (call) out.push(...tokenize(call[2]));
		} else if (number) out.push({ kind: 'number', value: number });
		else if (space) out.push({ kind: 'text', value: space });
		else out.push({ kind: 'symbol', value: all });
	}
	return out;
}

export function parse(source: string, file = 'pseudocode'): Line[] {
	const lines: Line[] = [];
	const raw = source.replace(/\s+$/, '').split('\n');
	let expectDeeper = false;
	let prevDepth = 0;
	raw.forEach((text, i) => {
		const where = `${file}:${i + 1}`;
		for (const [re, what] of FORBIDDEN)
			if (re.test(text.replace(/▷.*$/, '').replace(/"[^"]*"/g, '""')))
				throw new Error(`${where}: ${what}`);
		if (!text.trim()) throw new Error(`${where}: empty line (listings have no blank lines)`);
		const indent = /^ */.exec(text)![0].length;
		if (indent % 2) throw new Error(`${where}: indentation is not a multiple of two spaces`);
		const depth = indent / 2;
		const code = text.trim().replace(/\s*▷.*$/, '');
		if (i === 0 && !/^algorithm /.test(code))
			throw new Error(`${where}: a listing starts with "algorithm Name(…)"`);
		if (depth === 0 && code && !HEADER.test(code))
			throw new Error(`${where}: only algorithm, procedure and function headers start at column 0`);
		if (expectDeeper && depth !== prevDepth + 1)
			throw new Error(`${where}: the block opened on the line before needs one more level`);
		if (!expectDeeper && depth > prevDepth)
			throw new Error(`${where}: indented without a line that opens a block`);
		const prev = raw[i - 1]?.trim().replace(/\s*▷.*$/, '') ?? '';
		if (/^(input|output):/.test(code) && !(HEADER.test(prev) || /^input:/.test(prev)))
			throw new Error(`${where}: input and output lines follow a header`);
		expectDeeper = code !== '' && opensBlock(code);
		prevDepth = depth;
		lines.push({ depth, tokens: tokenize(text.trim()) });
	});
	if (expectDeeper) throw new Error(`${file}: the last line opens a block with nothing in it`);
	return lines;
}
