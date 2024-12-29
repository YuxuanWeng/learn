import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { useQuery } from '@tanstack/react-query';
import { fetchBondQuoteOperationLog } from '@/common/services/api/bond-quote/get-operation-log';
import { transform2OperationLogTableColumn } from './types';

const LIST_PREFETCH_STALE_TIME = 30000;
export const PAGE_SIZE = 50;

export const useOperationLogQuery = (
  quoteId?: string,
  keyMarket?: string,
  page?: number,
  logFlag?: string,
  config?: RequestConfig
) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: [APIs.bondQuote.getOperationLog, quoteId, keyMarket, page] as const,
    keepPreviousData: true,
    queryFn: async ({ signal }) => {
      if (!quoteId && !keyMarket) {
        return { quoteOperationLogList: [], total: 0 };
      }
      const result = await fetchBondQuoteOperationLog(
        {
          quote_id: quoteId,
          key_market: keyMarket,
          offset: ((page ?? 1) - 1) * PAGE_SIZE,
          count: PAGE_SIZE
        },
        { signal, logFlag, ...config }
      );

      return {
        quoteOperationLogList: (result.log_list ?? []).map(transform2OperationLogTableColumn),
        total: Math.min(result.total, 500)
      };
    },
    staleTime: LIST_PREFETCH_STALE_TIME
  });

  return {
    quoteOperationLogList: data?.quoteOperationLogList ?? [],
    total: data?.total ?? 0,
    isLoading,
    refetch
  };
};
