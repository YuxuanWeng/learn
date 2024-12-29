import { fakeBondLite } from '@fepkg/mock/utils/fake';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/common/utils/query-client';
import { BondCode } from '../BondCode';

export default {
  title: 'IDC业务组件/历史记录/债券代码',
  component: BondCode
};

export const Basic = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BondCode
        editable
        defaultBond={fakeBondLite()}
      />
    </QueryClientProvider>
  );
};
Basic.storyName = '基本用法';
