<script lang="ts">
	/** The mark: a small search tree whose cheapest path is lit. */
	let { size = '1.75rem' }: { size?: string } = $props();
</script>

<svg class="logo" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
	<path d="M8 23 16 9l8 14" fill="none" stroke="var(--color-text-muted)" stroke-width="2" />
	<path d="M8 23h16" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" />
	<circle cx="16" cy="9" r="3" fill="var(--color-text-strong)" />
	<circle cx="8" cy="23" r="3" fill="var(--accent)" />
	<circle cx="24" cy="23" r="3" fill="var(--accent)" />
</svg>
