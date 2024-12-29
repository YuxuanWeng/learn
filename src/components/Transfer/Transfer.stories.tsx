import { useState } from 'react';
import { Transfer } from '.';
import { TransferOption } from './types';

export default {
  title: '业务组件/穿梭框',
  component: Transfer
};

export const Basic = () => {
  const [data] = useState<TransferOption[]>([
    { key: '1', title: 'a' },
    { key: '2', title: 'b' },
    { key: '3', title: 'c' },
    { key: '4', title: 'd' }
  ]);
  const [sourceKeys, setSourceKeys] = useState<string[]>(['1', '2']);
  const [targetKeys, setTargetKeys] = useState<string[]>(['3', '4']);

  const onChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSourceKeys(sourceSelectedKeys);
    setTargetKeys(targetSelectedKeys);
  };

  return (
    <div className="h-18 p-4">
      <Transfer
        options={data}
        sourceTitle="隐藏列"
        targetTitle="显示列"
        sourceKeys={sourceKeys}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </div>
  );
};

Basic.storyName = '基本用法';
