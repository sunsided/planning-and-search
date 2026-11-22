import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.ts'],
	framework: '@storybook/sveltekit',
	addons: ['@storybook/addon-docs'],
	core: { disableTelemetry: true }
};

export default config;
