import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { AUDIENCES } from '../src/lib/audiences.ts';
import { CRATES } from '../src/lib/registry.ts';
import { lint } from '../src/lib/richtext.ts';

const released = new Set(CRATES.flatMap((c) => c.algorithms));
const crates = new Set(CRATES.map((c) => c.name));

test('every audience points at real crates and released algorithms', () => {
	assert.equal(new Set(AUDIENCES.map((a) => a.slug)).size, AUDIENCES.length);
	for (const a of AUDIENCES) {
		assert.match(a.slug, /^[a-z]+(-[a-z]+)*$/);
		for (const p of [a.start, ...a.crates]) assert.ok(crates.has(p.crate), `${a.slug}: ${p.crate}`);
		const picked = [a.start.crate, ...a.crates.map((p) => p.crate)];
		assert.equal(new Set(picked).size, picked.length, `${a.slug}: a crate twice`);
		for (const s of a.algorithms) assert.ok(released.has(s), `${a.slug}: algorithm ${s}`);
	}
});

test('the copy reads as on release day and keeps sentences short', () => {
	for (const a of AUDIENCES) {
		const text = [a.teaser, a.lead, a.start.why, a.start.first, ...a.crates.map((p) => p.why)];
		for (const t of text) {
			assert.deepEqual(lint(t), [], `${a.slug}: ${t}`);
			// ASD-STE100 keeps procedural sentences to 20 words and descriptive ones to 25.
			for (const sentence of t.split(/(?<=[.!?])\s+/))
				assert.ok(sentence.split(/\s+/).length <= 25, `${a.slug}: long sentence: ${sentence}`);
		}
	}
});
