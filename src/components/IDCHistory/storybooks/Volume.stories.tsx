import { useState } from 'react';
import { MatchingVolume } from '../MatchingVolume';

export default {
  title: 'IDC业务组件/历史记录/成交量',
  component: MatchingVolume
};

export const Basic = () => {
  const [value, setValue] = useState<number>(2000);
  return (
    <div className="flex flex-col">
      <MatchingVolume
        editable
        volume={value}
        onChange={val => setValue(val)}
      />
    </div>
  );
};
Basic.storyName = '基本用法';
