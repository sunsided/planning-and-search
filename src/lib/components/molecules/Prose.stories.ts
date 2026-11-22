import type { Meta, StoryObj } from '@storybook/sveltekit';
import type { Block } from '#lib/richtext.js';
import { mapf } from '../stories/fixtures.ts';
import Prose from './Prose.svelte';

const meta = {
	title: 'Molecules/Prose',
	component: Prose,
	tags: ['autodocs']
} satisfies Meta<typeof Prose>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { blocks: mapf.audience as Block[] } };
