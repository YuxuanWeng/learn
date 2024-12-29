import { Meta, StoryObj } from '@storybook/react';
import { BadgeV2 } from '.';

const meta: Meta<typeof BadgeV2> = {
  title: '通用组件/BadgeV2',
  component: BadgeV2,
  render: args => {
    return (
      <div className="flex gap-3 p-6 bg-gray-900">
        <BadgeV2 {...args}>
          <div className="w-9 h-9 bg-gray-600 rounded-lg" />
        </BadgeV2>
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof BadgeV2>;

export const Primary: Story = {};
