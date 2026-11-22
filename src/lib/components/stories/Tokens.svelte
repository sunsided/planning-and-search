<script lang="ts">
	import { CATEGORIES } from '#lib/registry.js';

	/** The semantic tokens, rendered; flip the toolbar theme to see both halves of each pair. */
	const COLORS = [
		'bg',
		'bg-deep',
		'surface',
		'surface-raised',
		'line',
		'line-strong',
		'text',
		'text-strong',
		'text-muted'
	];
	const STEPS = ['-2', '-1', '0', '1', '2', '3', '4'];
	const SPACES = [1, 2, 3, 4, 5, 6, 7, 8];
</script>

<section>
	<h2>Colour</h2>
	<div class="swatches">
		{#each COLORS as c (c)}
			<figure>
				<div class="swatch" style:background="var(--color-{c})"></div>
				<figcaption><code>--color-{c}</code></figcaption>
			</figure>
		{/each}
	</div>
	<h2>Category accents</h2>
	<div class="swatches">
		{#each CATEGORIES as c (c.slug)}
			<figure data-accent style:--accent-h={c.hue}>
				<div class="swatch" style:background="var(--accent)"></div>
				<figcaption>{c.title} <code>{c.hue}°</code></figcaption>
			</figure>
		{/each}
	</div>
	<h2>Type scale</h2>
	{#each STEPS as s (s)}
		<p style:font-size="var(--step-{s})"><code>--step-{s}</code> Planning and search</p>
	{/each}
	<h2>Space</h2>
	{#each SPACES as s (s)}
		<div class="space">
			<code>--space-{s}</code><span style:inline-size="var(--space-{s})"></span>
		</div>
	{/each}
</section>

<style>
	section {
		display: grid;
		gap: var(--space-4);
	}
	h2 {
		margin-block-start: var(--space-5);
	}
	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
		gap: var(--space-3);
	}
	figure {
		margin: 0;
	}
	.swatch {
		block-size: 3rem;
		border: var(--border-hair);
		border-radius: var(--radius-m);
	}
	figcaption {
		font-size: var(--step--2);
	}
	.space {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.space code {
		inline-size: 7rem;
	}
	.space span {
		block-size: 1rem;
		background: var(--accent);
	}
</style>
