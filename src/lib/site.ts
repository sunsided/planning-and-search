/** Where the site is served from; vite.config.ts takes the same value for `paths.base`. */
export const BASE_PATH = '/planning-and-search';

/** The site's public origin, for the absolute URLs link previews and the sitemap need. */
export const ORIGIN = 'https://sunsided.github.io';

export const SITE_URL = `${ORIGIN}${BASE_PATH}`;

export const SITE_NAME = 'Planning & Search in Rust';

export const AUTHOR = 'Markus Mayer';

/** Where the rest lives. The legal pages are markusmayer.dev's own, for all the sites. */
export const LINKS = {
	author: 'https://markusmayer.dev/',
	github: 'https://github.com/sunsided',
	source: 'https://github.com/sunsided/planning-and-search',
	storybook: `${SITE_URL}/storybook/`,
	privacy: 'https://markusmayer.dev/privacy/',
	imprint: 'https://markusmayer.dev/imprint/'
} as const;
