<script lang="ts">
	import { AUTHOR, LINKS } from '#lib/site.js';
</script>

<footer class="footer">
	<p>
		Crates by <a href={LINKS.author} rel="external">{AUTHOR}</a>
		(<a href={LINKS.github} rel="external">sunsided</a>), dual-licensed MIT or Apache-2.0 unless a
		crate says otherwise.
	</p>
	<nav aria-label="Site">
		<a href={LINKS.source} rel="external">Site source</a>
		<a href={LINKS.storybook} rel="external">Design system</a>
		<a href={LINKS.privacy} rel="external">Privacy</a>
		<a href={LINKS.imprint} rel="external">Imprint</a>
	</nav>
</footer>

<style>
	.footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-4);
		inline-size: min(var(--page-max), 100% - 2 * var(--gutter));
		margin: var(--space-8) auto 0;
		padding-block: var(--space-6);
		border-block-start: var(--border-hair);
		color: var(--color-text-muted);
		font-size: var(--step--1);
	}
	p {
		max-inline-size: var(--measure);
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}
</style>
