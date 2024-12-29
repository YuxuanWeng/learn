import { useState } from 'react';
import RangeInput, { DateRangeInput, RangeInputValue } from '.';

export default {
  title: '业务组件/范围输入',
  component: RangeInput
};

export const Basic = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);
  return (
    <RangeInput
      value={values}
      onChange={setValues}
      className="w-44"
    />
  );
};
Basic.storyName = '基本用法';

export const Disabled = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);
  return (
    <RangeInput
      value={values}
      onChange={setValues}
      className="w-44"
      disabled
    />
  );
};
Disabled.storyName = '禁用';

export const Error = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);
  return (
    <RangeInput
      value={values}
      onChange={setValues}
      className="w-44"
      status="error"
    />
  );
};
Error.storyName = '错误';

export const DateRange = () => {
  const [values, setValues] = useState<RangeInputValue>(['', '']);
  return (
    <DateRangeInput
      value={values}
      onChange={setValues}
      className="w-44"
    />
  );
};

DateRange.storyName = '日期范围';
