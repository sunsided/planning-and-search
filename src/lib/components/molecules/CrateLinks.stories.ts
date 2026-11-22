import type { Meta, StoryObj } from '@storybook/sveltekit';
import { pddl } from '../stories/fixtures.ts';
import CrateLinks from './CrateLinks.svelte';

const meta = {
	title: 'Molecules/CrateLinks',
	component: CrateLinks,
	tags: ['autodocs']
} satisfies Meta<typeof CrateLinks>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { name: pddl.name, repo: pddl.repo } };
