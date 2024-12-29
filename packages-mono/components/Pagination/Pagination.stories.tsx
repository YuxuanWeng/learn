import { Pagination } from '.';

export default {
  title: '通用组件/Pagination'
};

export const PagDemo = () => {
  return (
    <div className="bg-gray-800 pt-1 pb-1">
      <Pagination
        showQuickJumper
        defaultCurrent={2}
        total={500}
      />
      <br />
      <Pagination
        showQuickJumper
        showSizeChanger={false}
        defaultCurrent={2}
        total={500}
        disabled
      />
    </div>
  );
};
PagDemo.storyName = 'Pagination';
