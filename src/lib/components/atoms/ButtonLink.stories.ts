import type { Meta, StoryObj } from '@storybook/sveltekit';
import { text } from '../stories/fixtures.ts';
import ButtonLink from './ButtonLink.svelte';

const meta = {
	title: 'Atoms/ButtonLink',
	component: ButtonLink,
	tags: ['autodocs']
} satisfies Meta<typeof ButtonLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: { href: '#', icon: 'book', variant: 'primary', children: text('Docs on docs.rs') }
};
export const Secondary: Story = {
	args: { href: '#', icon: 'github', children: text('sunsided/mapf-search') }
};
