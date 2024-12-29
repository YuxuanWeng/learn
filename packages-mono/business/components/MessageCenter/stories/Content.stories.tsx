import { Meta, StoryObj } from '@storybook/react';
import { Content } from '../Content';

const meta: Meta<typeof Content> = {
  title: '业务组件/MessageCenter/Content',
  component: Content,
  render: args => {
    return (
      <div className="flex flex-col gap-3 p-6 bg-gray-900">
        <Content />
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof Content>;

export const Primary: Story = {};
