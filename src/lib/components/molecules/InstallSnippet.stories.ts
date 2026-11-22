import type { Meta, StoryObj } from '@storybook/sveltekit';
import { mapf } from '../stories/fixtures.ts';
import InstallSnippet from './InstallSnippet.svelte';

const meta = {
	title: 'Molecules/InstallSnippet',
	component: InstallSnippet,
	tags: ['autodocs']
} satisfies Meta<typeof InstallSnippet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: mapf.name } };
