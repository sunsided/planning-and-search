import '@fontsource-variable/ibm-plex-sans';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import '../src/lib/design/tokens.css';
import '../src/lib/design/base.css';
import type { Preview } from '@storybook/sveltekit';

// The toolbar's theme sets the same attribute the site's switcher does.
const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'Colour theme',
			toolbar: {
				icon: 'contrast',
				dynamicTitle: true,
				items: [
					{ value: 'auto', title: 'System' },
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' }
				]
			}
		}
	},
	initialGlobals: { theme: 'auto' },
	decorators: [
		(story, { globals }) => {
			const root = document.documentElement;
			if (globals.theme === 'light' || globals.theme === 'dark') root.dataset.theme = globals.theme;
			else delete root.dataset.theme;
			return story();
		}
	],
	parameters: { layout: 'padded', controls: { expanded: true } }
};

export default preview;
