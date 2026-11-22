<script lang="ts" module>
	export interface AudienceCard {
		title: string;
		teaser: string;
		href: string;
	}
</script>

<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';

	/** "For …" entry points at the top of the overview: one card per group of readers. */
	let { audiences }: { audiences: AudienceCard[] } = $props();
</script>

<section class="audiences" aria-labelledby="audiences-title">
	<h2 id="audiences-title">Find your way in</h2>
	<ul class="grid">
		{#each audiences as a (a.href)}
			<li>
				<a href={a.href}>
					<span class="for">For {a.title}</span>
					<span class="teaser">{a.teaser}</span>
					<Icon name="arrow" />
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.audiences {
		display: grid;
		gap: var(--space-4);
	}
	h2 {
		font-size: var(--step-2);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--track-card)), 1fr));
		gap: var(--space-3);
		padding: 0;
		list-style: none;
	}
	a {
		position: relative;
		display: grid;
		gap: var(--space-1);
		block-size: 100%;
		padding: var(--space-4) var(--space-6) var(--space-4) var(--space-4);
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
		text-decoration: none;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			translate var(--dur-mid) var(--ease-out);
	}
	a:hover {
		border-color: var(--accent-line);
		translate: 0 var(--lift);
	}
	.for {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
	}
	.teaser {
		color: var(--color-text-muted);
		font-size: var(--step--1);
		line-height: var(--leading-snug);
	}
	a :global(.icon) {
		position: absolute;
		inset-block-start: var(--space-4);
		inset-inline-end: var(--space-4);
		color: var(--accent);
	}
</style>
