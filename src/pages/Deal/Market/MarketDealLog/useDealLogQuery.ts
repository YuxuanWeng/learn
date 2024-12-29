import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketDealOperationLog } from '@/common/services/api/market-deal/get-operation-log';
import { transform2DealLogTableColumn } from './utils';

const LIST_PREFETCH_STALE_TIME = 30000;
export const PAGE_SIZE = 50;

export const useDealLogQuery = (dealId?: string, page?: number, logFlag?: string, config?: RequestConfig) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [APIs.marketDeal.getOperationLog, dealId, page] as const,
    keepPreviousData: true,
    queryFn: async ({ signal }) => {
      if (!dealId) {
        return { marketDealOperationLogList: [], total: 0 };
      }
      const result = await fetchMarketDealOperationLog(
        {
          market_deal_id: dealId,
          offset: ((page ?? 1) - 1) * PAGE_SIZE,
          count: PAGE_SIZE
        },
        { signal, logFlag, ...config }
      );
      return {
        marketDealOperationLogList: (result.log_list ?? []).map(transform2DealLogTableColumn),
        total: Math.min(result.total, 500)
      };
    },
    staleTime: LIST_PREFETCH_STALE_TIME
  });

  return {
    dealOperationLogList: data?.marketDealOperationLogList ?? [],
    total: data?.total ?? 0,
    isLoading,
    refetch
  };
};
