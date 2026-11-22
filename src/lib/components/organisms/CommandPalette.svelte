<script lang="ts">
	import Icon from '#lib/components/atoms/Icon.svelte';
	import Kbd from '#lib/components/atoms/Kbd.svelte';
	import Node from '#lib/components/atoms/Node.svelte';
	import { search, type Entry, type Hit } from '#lib/search.js';
	import { onMount } from 'svelte';

	/**
	 * Find anything by word: a trigger button, and a dialog that Ctrl+K (⌘K on a Mac) also
	 * opens. The input is a combobox over a listbox of results; arrows move, Enter opens.
	 */
	let { entries, go }: { entries: Entry[]; go: (href: string) => void } = $props();

	const id = $props.id();
	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let active = $state(0);
	let mac = $state(false);
	const hits = $derived(search(entries, query));

	onMount(() => (mac = /Mac|iPhone|iPad/.test(navigator.userAgent)));

	function open() {
		query = '';
		active = 0;
		dialog?.showModal();
		input?.focus();
	}

	function choose(hit: Hit) {
		dialog?.close();
		go(hit.entry.href);
	}

	function onwindowkeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			if (dialog?.open) dialog.close();
			else open();
		}
	}

	function oninputkeydown(e: KeyboardEvent) {
		const n = hits.length;
		if (!n) return;
		if (e.key === 'ArrowDown') active = (active + 1) % n;
		else if (e.key === 'ArrowUp') active = (active - 1 + n) % n;
		else if (e.key === 'Enter') choose(hits[active]);
		else return;
		e.preventDefault();
	}

	$effect(() => {
		document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' });
	});
</script>

<svelte:window onkeydown={onwindowkeydown} />

<button
	class="trigger"
	type="button"
	onclick={open}
	aria-haspopup="dialog"
	aria-keyshortcuts="Control+K Meta+K"
>
	<Icon name="search" />
	<span class="trigger-label">Search</span>
	<span class="trigger-keys"><Kbd>{mac ? '⌘ K' : 'Ctrl K'}</Kbd></span>
</button>

<!-- A click on the backdrop lands on the dialog itself; keyboard users have Esc. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="palette"
	aria-label="Search the site"
	onclick={(e) => e.target === dialog && dialog.close()}
>
	<div class="field">
		<Icon name="search" />
		<input
			bind:this={input}
			bind:value={query}
			oninput={() => (active = 0)}
			onkeydown={oninputkeydown}
			type="search"
			role="combobox"
			aria-label="Search crates and topics"
			aria-expanded={hits.length > 0}
			aria-controls="{id}-list"
			aria-autocomplete="list"
			aria-activedescendant={hits.length ? `${id}-${active}` : undefined}
			placeholder="Search crates, algorithms and topics"
			autocomplete="off"
			spellcheck="false"
		/>
		<Kbd>Esc</Kbd>
	</div>

	<p class="visually-hidden" role="status">
		{query ? `${hits.length} results` : ''}
	</p>

	{#if hits.length}
		<ul id="{id}-list" class="results" role="listbox" aria-label="Results">
			{#each hits as hit, i (hit.entry.href)}
				<!-- The input owns the keyboard (aria-activedescendant); the pointer picks here. -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id="{id}-{i}"
					role="option"
					aria-selected={i === active}
					data-accent
					style:--accent-h={hit.entry.hue}
					onclick={() => choose(hit)}
					onpointermove={() => (active = i)}
				>
					<Node size="0.6em" hollow={hit.entry.kind === 'category'} />
					<span class="text">
						<span class="title">
							{#if hit.entry.kind === 'crate'}<code>{hit.entry.title}</code>{:else}{hit.entry
									.title}{/if}
						</span>
						<span class="sub">{hit.snippet ?? hit.entry.subtitle}</span>
					</span>
					<span class="kind">{hit.entry.kind === 'crate' ? 'Crate' : 'Topic'}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="empty">Nothing matches “{query}”.</p>
	{/if}

	<footer class="help" aria-hidden="true">
		<span><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
		<span><Kbd>↵</Kbd> open</span>
		<span><Kbd>Esc</Kbd> close</span>
	</footer>
</dialog>

<style>
	.trigger {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-block-size: var(--control-m);
		padding: 0 var(--space-2) 0 var(--space-3);
		border: var(--border-hair);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		color: var(--color-text-muted);
		font: inherit;
		font-size: var(--step--1);
		cursor: pointer;
	}
	.trigger:hover {
		border-color: var(--color-line-strong);
		color: var(--color-text-strong);
	}
	@media (width < 40rem) {
		/* A literal: media queries cannot read custom properties. */
		.trigger {
			padding-inline: var(--space-3);
		}
		.trigger-label,
		.trigger-keys {
			display: none;
		}
	}

	.palette {
		inline-size: min(var(--dialog-width), 100% - 2 * var(--gutter));
		max-block-size: 70dvh;
		margin: 12dvh auto auto;
		padding: 0;
		border: var(--border-hair);
		border-radius: var(--radius-l);
		background: var(--color-surface);
		color: var(--color-text);
		box-shadow: var(--shadow-raised);
	}
	.palette[open] {
		display: flex;
		flex-direction: column;
	}
	.palette::backdrop {
		background: color-mix(in oklab, var(--color-bg-deep) 60%, transparent);
		backdrop-filter: blur(2px);
	}

	.field {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-block-end: var(--border-hair);
		color: var(--color-text-muted);
	}
	input {
		flex: 1;
		min-inline-size: 0;
		border: 0;
		background: none;
		color: var(--color-text-strong);
		font: inherit;
		font-size: var(--step-1);
	}
	input:focus {
		outline: none;
	}
	input::-webkit-search-cancel-button {
		display: none;
	}

	.results {
		flex: 1;
		overflow-y: auto;
		margin: 0;
		padding: var(--space-2);
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-m);
		cursor: pointer;
	}
	li[aria-selected='true'] {
		background: var(--accent-wash);
		box-shadow: inset var(--focus-width) 0 0 var(--accent);
	}
	.text {
		display: grid;
		flex: 1;
		min-inline-size: 0;
	}
	.title {
		color: var(--color-text-strong);
		font-weight: var(--weight-strong);
	}
	.title code {
		padding: 0;
		background: none;
	}
	.sub {
		overflow: hidden;
		color: var(--color-text-muted);
		font-size: var(--step--1);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.kind {
		color: var(--color-text-muted);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: var(--tracking-label);
		text-transform: uppercase;
	}
	.empty {
		padding: var(--space-6) var(--space-4);
		color: var(--color-text-muted);
		text-align: center;
	}
	.help {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-2) var(--space-4);
		border-block-start: var(--border-hair);
		color: var(--color-text-muted);
		font-size: var(--step--2);
	}
	.help span {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}
</style>
