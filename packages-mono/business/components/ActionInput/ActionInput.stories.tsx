import { Meta, StoryObj } from '@storybook/react';
import { ActionInput } from './ActionInput';

const meta: Meta<typeof ActionInput> = {
  title: '业务组件/ActionInput',
  component: ActionInput,
  render: args => {
    return (
      <div className="flex flex-col gap-3 p-6 bg-gray-900">
        <ActionInput {...args} />
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof ActionInput>;

export const Primary: Story = {
  args: {
    className: 'w-50',
    showTrigger: true,
    onSubmit: console.log
  }
};
