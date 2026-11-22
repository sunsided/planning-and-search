import type { Meta, StoryObj } from '@storybook/sveltekit';
import { go, loadSearch } from '../stories/fixtures.ts';
import SiteHeader from './SiteHeader.svelte';

const meta = {
	title: 'Organisms/SiteHeader',
	component: SiteHeader,
	tags: ['autodocs']
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { home: '#', algorithms: '#', load: loadSearch, go } };
