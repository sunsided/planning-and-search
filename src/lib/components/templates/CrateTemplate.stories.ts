import type { Meta, StoryObj } from '@storybook/sveltekit';
import { dependents } from '#lib/registry.js';
import { algorithmItems, category, mapf, pddl, refs } from '../stories/fixtures.ts';
import CrateTemplate from './CrateTemplate.svelte';

const meta = {
	title: 'Templates/CrateTemplate',
	component: CrateTemplate,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof CrateTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		crate: mapf,
		category: category(mapf.name),
		back: '#',
		dependencies: refs(mapf.deps.map((d) => d.name)),
		dependents: refs(dependents(mapf.name).map((d) => d.name)),
		algorithms: algorithmItems(mapf.name)
	}
};
export const WithWorkspace: Story = {
	args: {
		crate: pddl,
		category: category(pddl.name),
		back: '#',
		dependencies: [],
		dependents: [],
		algorithms: algorithmItems(pddl.name)
	}
};
