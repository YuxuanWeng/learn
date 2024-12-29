import { useState } from 'react';
import { Switch } from '.';

export default {
  title: '通用组件/Switch',
  component: Switch
};

export const Basic = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>
        <span className="text-white">当前开关状态：{checked ? '开' : '关'}</span>
        <Switch
          checked={checked}
          onChange={val => setChecked(val)}
        />
        <Switch
          disabled
          checked
        />
        <Switch disabled />
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
