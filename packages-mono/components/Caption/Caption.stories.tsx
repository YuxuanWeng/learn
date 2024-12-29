import { IconCheck } from '@fepkg/icon-park-react';
import { Caption } from '.';

export default {
  title: '通用组件/Caption',
  component: Caption
};

export const Basic = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 p-6 bg-gray-800">
        <Caption>primary 模块标题</Caption>
        <Caption type="secondary">secondary 模块标题</Caption>
        <Caption type="orange">orange 模块标题</Caption>
        <Caption icon={<IconCheck />}>icon 模块标题</Caption>
        <Caption size="xs">小标题</Caption>
      </div>
    </div>
  );
};

Basic.storyName = '基本使用';
