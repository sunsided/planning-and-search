<script lang="ts">
	import type { Line } from '#lib/pseudo.js';

	/** A listing in the site's pseudo-language: numbered lines, keywords in bold, routine
	 * names in small capitals, sets in capitals, comments muted. Indent guides show blocks. */
	let { lines, label }: { lines: Line[]; label: string } = $props();
</script>

<figure class="pseudo">
	<pre aria-label={label}><code
			>{#each lines as line, n (n)}<span class="line" style:--depth={line.depth}
					><span class="no" aria-hidden="true">{n + 1}</span><span class="code"
						>{#each line.tokens as t, k (k)}<span class={t.kind}>{t.value}</span>{/each}</span
					></span
				>{/each}</code
		></pre>
</figure>

<style>
	.pseudo {
		margin: 0;
		overflow-x: auto;
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
	}
	pre {
		margin: 0;
		padding: var(--space-4) var(--space-4) var(--space-4) 0;
		font-family: var(--font-mono);
		font-size: var(--step--1);
		line-height: var(--leading-text);
		tab-size: 2;
	}
	code {
		display: grid;
		padding: 0;
		background: none;
		color: var(--color-text);
		font-size: inherit;
	}
	.line {
		display: grid;
		grid-template-columns: 3.5ch 1fr;
		gap: var(--space-3);
	}
	.no {
		color: var(--color-text-muted);
		opacity: 0.6;
		text-align: end;
		user-select: none;
	}
	.code {
		padding-inline-start: calc(var(--depth) * 2ch);
		/* One guide per level, two characters apart. */
		background-image: repeating-linear-gradient(
			90deg,
			var(--color-line) 0 var(--border-width),
			transparent var(--border-width) 2ch
		);
		background-size: calc(var(--depth) * 2ch) 100%;
		background-repeat: no-repeat;
		white-space: pre;
	}
	.keyword {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
	}
	.routine {
		color: var(--accent);
		font-variant-caps: small-caps;
		font-family: var(--font-sans);
		font-size: 1.05em;
		letter-spacing: 0.02em;
	}
	.set {
		color: var(--color-text-strong);
		letter-spacing: 0.04em;
	}
	.name {
		font-style: italic;
		font-family: var(--font-sans);
	}
	.comment {
		color: var(--color-text-muted);
		font-style: italic;
	}
	.string {
		color: var(--color-text-strong);
	}
</style>
