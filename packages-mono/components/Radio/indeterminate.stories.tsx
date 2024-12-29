import { ReactNode } from 'react';
import { CheckboxOption } from '../Checkbox';
import { RadioIndeterminateGroup } from './IndeterminateGroup';

export default {
  title: '通用组件/Radio/RadioIndeterminateGroup',
  component: RadioIndeterminateGroup
};

const renderGroup = (title: string, group: ReactNode) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-trd-300">{title}</span>
      <div className="flex items-center">{group}</div>
    </div>
  );
};

export const Basic = () => {
  const options: CheckboxOption[] = [
    { label: 'apple', value: 'apple' },
    { label: 'banana', value: 'banana' },
    { label: 'orange', value: 'orange' }
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-6 bg-gray-900">
        <h2 className="text-white">Dark theme</h2>

        {renderGroup(
          '默认',
          <RadioIndeterminateGroup
            ctrl
            otherCancel
            options={options}
          />
        )}
        {renderGroup(
          '禁用',
          <RadioIndeterminateGroup
            disabled
            options={options}
          />
        )}
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
