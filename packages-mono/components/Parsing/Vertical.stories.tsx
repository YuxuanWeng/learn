import { ReactNode, useState } from 'react';
import { Parsing } from '.';

export default {
  title: '通用组件/Parsing/Vertical',
  component: Parsing.Vertical
};

const renderParsing = (title: string, parsing: ReactNode) => {
  return (
    <div className="flex gap-3">
      <span className="w-20 py-4 text-trd-300">{title}</span>
      {parsing}
    </div>
  );
};

export const Basic = () => {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-3 p-6 bg-gray-900">
      {renderParsing(
        '默认',
        <Parsing.Vertical
          value={value}
          onChange={val => {
            setValue(val);
          }}
          onSecondaryClick={() => {
            setValue('');
          }}
          onPrimaryClick={console.log}
        />
      )}
      {renderParsing('无法识别', <Parsing.Vertical error />)}
    </div>
  );
};

Basic.storyName = '基本使用';
