import type { Meta, StoryObj } from '@storybook/sveltekit';
import { relatedCrates } from '#lib/registry.js';
import RelatedCrates from './RelatedCrates.svelte';

const meta = {
	title: 'Organisms/RelatedCrates',
	component: RelatedCrates,
	tags: ['autodocs']
} satisfies Meta<typeof RelatedCrates>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { crates: relatedCrates() } };
