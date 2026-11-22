<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import { applyTheme, storedTheme, THEMES, type Theme } from '#lib/theme.js';
	import { onMount } from 'svelte';

	const LABELS: Record<Theme, string> = { auto: 'System', light: 'Light', dark: 'Dark' };
	const ICONS = { auto: 'auto', light: 'sun', dark: 'moon' } as const;

	let theme = $state<Theme>('auto');
	onMount(() => (theme = storedTheme()));
</script>

<fieldset class="switcher">
	<legend class="visually-hidden">Colour theme</legend>
	{#each THEMES as t (t)}
		<label title={LABELS[t]}>
			<input
				type="radio"
				name="theme"
				value={t}
				bind:group={theme}
				onchange={() => applyTheme(t)}
			/>
			<Icon name={ICONS[t]} />
			<span class="visually-hidden">{LABELS[t]}</span>
		</label>
	{/each}
</fieldset>

<style>
	.switcher {
		display: inline-flex;
		gap: var(--inset-tight);
		margin: 0;
		padding: var(--inset-tight);
		border: var(--border-hair);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
	}
	label {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: var(--control-s);
		block-size: var(--control-s);
		border-radius: var(--radius-pill);
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			background-color var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}
	label:hover {
		color: var(--color-text-strong);
	}
	label:has(:checked) {
		background: var(--accent-wash);
		color: var(--color-text-strong);
	}
	label:has(:focus-visible) {
		outline: var(--focus-width) solid var(--color-focus);
		outline-offset: calc(var(--focus-offset) - var(--inset-tight));
	}
	input {
		position: absolute;
		inset: 0;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}
</style>
