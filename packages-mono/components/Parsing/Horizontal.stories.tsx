import { ReactNode, useState } from 'react';
import { Parsing } from '.';

export default {
  title: '通用组件/Parsing/Horizontal',
  component: Parsing.Horizontal
};

const renderParsing = (title: string, parsing: ReactNode) => {
  return (
    <div className="flex gap-3">
      <span className="w-20 py-4 text-trd-300">{title}</span>
      <div className="flex-1">{parsing}</div>
    </div>
  );
};

export const Basic = () => {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-3 p-6 bg-gray-900">
      {renderParsing(
        '默认',
        <Parsing.Horizontal
          value={value}
          onChange={val => {
            setValue(val);
          }}
          controllers={[]}
          onSecondaryClick={console.log}
          onPrimaryClick={console.log}
        />
      )}
    </div>
  );
};

Basic.storyName = '基本使用';
