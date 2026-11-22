import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { BASE_PATH } from './src/lib/site.ts';

export default defineConfig({
	// The build date, in UTC so the prerendered page and hydration agree.
	define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: '404.html', strict: true }),
			paths: { base: BASE_PATH, relative: true },
			prerender: {
				handleHttpError: 'fail',
				handleMissingId: 'fail',
				handleEntryGeneratorMismatch: 'fail'
			}
		})
	]
});
