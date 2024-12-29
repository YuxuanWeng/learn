import { Highlight } from '.';

export default {
  title: '通用组件/Highlight',
  component: Highlight
};

export const Basic = () => {
  return (
    <div className="flex gap-2">
      <Highlight keyword="一段">一段很长的内容</Highlight>
    </div>
  );
};

Basic.storyName = '基本使用';
