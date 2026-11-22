// Validates the content of the given algorithms (content/algorithms/<slug>/), the same way
// the build does: node scripts/check-algorithm.ts a-star rrt-star

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { check } from '../src/lib/algorithm-meta.ts';
import { ALGORITHMS } from '../src/lib/algorithms.ts';
import { parse } from '../src/lib/pseudo.ts';
import { TRACES } from '../src/lib/traces/index.ts';

const known = {
	slugs: new Set(ALGORITHMS.map((a) => a.slug)),
	traces: new Set(Object.keys(TRACES))
};
let failed = 0;
for (const slug of process.argv.slice(2)) {
	const dir = `content/algorithms/${slug}`;
	try {
		if (!known.slugs.has(slug)) throw new Error(`${slug}: not in content/algorithms.json`);
		if (!existsSync(`${dir}/meta.json`)) throw new Error(`${dir}/meta.json is missing`);
		check(slug, JSON.parse(readFileSync(`${dir}/meta.json`, 'utf8')), known);
		if (existsSync(`${dir}/pseudocode.txt`))
			parse(readFileSync(`${dir}/pseudocode.txt`, 'utf8'), `${dir}/pseudocode.txt`);
		for (const f of readdirSync(dir))
			if (!['meta.json', 'pseudocode.txt'].includes(f))
				throw new Error(`${dir}/${f}: unexpected file`);
		console.log(`ok ${slug}`);
	} catch (e) {
		failed++;
		console.error(`FAIL ${(e as Error).message}`);
	}
}
process.exit(failed ? 1 : 0);
