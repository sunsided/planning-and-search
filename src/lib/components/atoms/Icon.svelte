<script lang="ts" module>
	// 24×24 strokes, drawn in currentColor. Decorative unless given a label.
	const PATHS = {
		github:
			'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
		package: 'M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v0M4 7.5l8 4.5 8-4.5M12 12v9',
		book: 'M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13M8 7h7',
		sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
		moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
		auto: 'M12 3a9 9 0 1 0 0 18V3Zm0 0a9 9 0 1 1 0 18',
		arrow: 'M5 12h14m-6-6 6 6-6 6',
		back: 'M19 12H5m6 6-6-6 6-6',
		copy: 'M9 9h10v10H9V9Zm-4 6V5h10',
		check: 'm5 12 5 5 9-10',
		search: 'm20 20-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
		play: 'M7 4.5v15l12-7.5-12-7.5Z',
		pause: 'M8 5v14M16 5v14',
		first: 'M6 5v14m12-14-8 7 8 7',
		enter: 'M20 5v7a3 3 0 0 1-3 3H5m4-4-4 4 4 4'
	} as const;
	export type IconName = keyof typeof PATHS;
	export const ICONS = Object.keys(PATHS) as IconName[];
</script>

<script lang="ts">
	let { name, size = '1em', label }: { name: IconName; size?: string; label?: string } = $props();
</script>

<svg
	class="icon"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	<path d={PATHS[name]} />
</svg>

<style>
	.icon {
		display: inline-block;
		flex: none;
		vertical-align: -0.125em;
	}
</style>
