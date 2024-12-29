import { Meta, StoryObj } from '@storybook/react';
import { SettingLayout } from '.';

const meta: Meta<typeof SettingLayout> = {
  title: '通用组件/SettingLayout',
  component: SettingLayout,
  render: args => {
    return (
      <div className="flex flex-col gap-3 p-6 bg-gray-900">
        <SettingLayout {...args} />
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof SettingLayout>;

export const Primary: Story = {
  args: {
    aside: <SettingLayout.Aside label="模板列表">Aside</SettingLayout.Aside>,
    header: <SettingLayout.Header>Header</SettingLayout.Header>
  }
};
