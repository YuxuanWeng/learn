import { CommentInput } from './Input';

export default {
  title: '业务组件/CommentInput',
  components: CommentInput
};

export const Basic = () => {
  return (
    <div className="flex items-baseline p-4 bg-gray-900">
      <span className="w-20 text-trd-300">默认</span>
      <CommentInput className="flex-1" />
    </div>
  );
};
Basic.storyName = '基本用法';
