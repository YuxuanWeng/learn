import { Button } from '@fepkg/components/Button';
import { CommonDatePicker } from '@fepkg/components/DatePicker/CommonPicker';
import { Input } from '@fepkg/components/Input';
import { Select } from '@fepkg/components/Select';
import { IconEdit } from '@fepkg/icon-park-react';
import { Combination } from '.';
import { CombinationProps } from './types';

export default {
  title: '通用组件/Combination',
  component: Combination
};

const options = [
  { value: 1, label: '成交日' },
  { value: 2, label: '交易日' }
];

const args: CombinationProps = {
  size: 'sm',
  disabled: false,
  // background: ['bg-transparent', 'bg-gray-600'],
  // containerCls: 'w-[240px]',
  prefixNode: <Input />,
  suffixNode: '厘'
};

export const InputWithText = {
  render: (props: CombinationProps) => (
    <div className="bg-gray-700 w-96 p-4 flex flex-col gap-2">
      <p>input+text</p>
      <Combination
        {...props}
        prefixNode={<Input />}
        suffixNode="厘"
      />
      <p>select+button</p>
      <Combination
        {...props}
        prefixNode={
          <Select
            className="w-full"
            options={options}
          />
        }
        suffixNode={
          <Button.Icon
            // className={cx(props.disabled ? 'bg-gray-700' : '')}
            icon={<IconEdit />}
          />
        }
      />
      <p>select+date-picker</p>
      <Combination
        {...props}
        prefixNode={<Select className="flex-1" />}
        suffixNode={
          // antd组件由外面处理border
          <CommonDatePicker className="w-[148px] border border-solid border-gray-800 hover:border-primary-000" />
        }
      />
      <p>可控状态</p>
      <Combination {...props} />
    </div>
  ),
  args
};
