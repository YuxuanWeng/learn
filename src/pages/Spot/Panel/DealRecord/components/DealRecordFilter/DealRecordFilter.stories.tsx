import { DealRecordFilter } from '.';
import { DealRecordProvider } from '../../providers/DealRecordProvider';

export default {
  title: 'IDC业务组件/历史记录/筛选',
  component: DealRecordFilter
};

export const Basic = () => {
  return (
    <DealRecordProvider>
      <DealRecordFilter />
    </DealRecordProvider>
  );
};
Basic.storyName = '基本用法';
