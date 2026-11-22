import type { Meta, StoryObj } from '@storybook/sveltekit';
import { go, searchEntries } from '../stories/fixtures.ts';
import CommandPalette from './CommandPalette.svelte';

const meta = {
	title: 'Organisms/CommandPalette',
	component: CommandPalette,
	tags: ['autodocs']
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Press the button, or Ctrl+K / ⌘K inside the preview. */
export const Default: Story = { args: { entries: searchEntries, go } };
