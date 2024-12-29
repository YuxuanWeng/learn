import { Search } from './Search';

export default {
  title: '通用组件/Search',
  component: Search
};

export const Basic = () => {
  return (
    <div className="flex p-4 bg-gray-900">
      <Search />
    </div>
  );
};
Basic.storyName = '基本用法';
