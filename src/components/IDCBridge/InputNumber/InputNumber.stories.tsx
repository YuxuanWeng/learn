import { useState } from 'react';
import { InputNumber } from '.';

export default {
  title: 'IDC业务组件/过桥/inputNumber',
  parameters: {
    docs: {
      description: {
        component: `
        `
      }
    }
  },
  decorators: []
};

export const InputNumberDemo1 = () => {
  const [value, setValue] = useState<string>();
  return (
    <div>
      <InputNumber
        max={9999.9999}
        min={0}
        value={value}
        onChange={v => {
          setValue(v);
        }}
        pointNum={4}
      />
      <p>{value}</p>
    </div>
  );
};
InputNumberDemo1.storyName = '数字输入框 最大值9999.9999 最小值0';

export const InputNumberDemo2 = () => {
  const [value, setValue] = useState<string>();
  return (
    <div>
      <InputNumber
        max={9999}
        min={0}
        value={value}
        onChange={v => {
          setValue(v);
        }}
        pointNum={0}
      />
      <p>{value}</p>
    </div>
  );
};
InputNumberDemo2.storyName = '数字搜索框  只能输入0-9999的整数';

export const InputNumberDemo3 = () => {
  const [value, setValue] = useState<string>();
  return (
    <div>
      <InputNumber
        max={9999.99}
        min={0}
        value={value}
        onChange={v => {
          setValue(v);
        }}
        integerNum={4}
        pointNum={2}
      />
      <p>{value}</p>
    </div>
  );
};
InputNumberDemo3.storyName = '数字搜索框  只能输入0-9999.99的数值';
