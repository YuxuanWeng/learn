import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/common/utils/query-client';
import { DealRecord } from '.';

export default {
  title: 'IDC业务组件/历史记录/综合展示',
  parameters: {
    docs: {
      description: {
        component: `
        `
      }
    }
  }
};

/**
 * 交易处理页面
 */
export const TransactionHandling = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex gap-2 justify-between p-2 bg-gray-800">
        <div>债券面板</div>
        <div className="w-[676px]">
          {/* 历史成交记录展示 */}
          <DealRecord />
        </div>
      </div>
    </QueryClientProvider>
  );
};
