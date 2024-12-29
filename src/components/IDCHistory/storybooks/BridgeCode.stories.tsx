import { useState } from 'react';
import { BridgeMark } from '../BridgeMark';

export default {
  title: 'IDC业务组件/历史记录/过桥按钮',
  component: BridgeMark
};

export const Basic = () => {
  const [bridge, setBridge] = useState<boolean>(false);
  return (
    <BridgeMark
      internalCode="8"
      isBridge={bridge}
      onChange={() => setBridge(val => !val)}
    />
  );
};
Basic.storyName = '基本用法';
