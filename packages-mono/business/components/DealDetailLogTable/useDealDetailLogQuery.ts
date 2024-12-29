import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealDetailOperationLog } from '@fepkg/services/types/bds-common';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { detailOperationLogSearch } from '@/common/services/api/deal/detail-operation-log-search';
import { RECEIPT_DEAL_LOG_TABLE_MAX_PAGE, RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE } from '../ReceiptDealLogTable/constants';

/** fetchReceiptDealOperationLog 接口返回并转换后的数据 */
export type DealDetailOperationLogFetchData = {
  list: DealDetailOperationLog[];
  total: number;
};

export const getDealDetailLogQueryKey = (dealId: string, page: number) => {
  return [APIs.deal.detailOperationLogSearch, dealId, page] as const;
};

const getDealDetailLogQueryFn =
  (
    requestConfig?: RequestConfig
  ): QueryFunction<DealDetailOperationLogFetchData, ReturnType<typeof getDealDetailLogQueryKey>> =>
  async ({ signal, queryKey }) => {
    const [, dealId, page] = queryKey;

    // 超过 10 页后，只能请求第 10 页
    let offset = (page - 1) * RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE;
    if (page >= RECEIPT_DEAL_LOG_TABLE_MAX_PAGE) offset = RECEIPT_DEAL_LOG_TABLE_MAX_PAGE - 1;

    try {
      const res = await detailOperationLogSearch(
        {
          deal_id: dealId,
          offset,
          count: RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE
        },
        { ...requestConfig, signal }
      );
      return { list: res?.log_list ?? [], total: res?.total };
    } catch {
      return { list: [], total: 0 };
    }
  };

const receiptDealLogQueryFn = getDealDetailLogQueryFn();

export const useDealDetailLogQuery = (...args: Parameters<typeof getDealDetailLogQueryKey>) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: getDealDetailLogQueryKey(...args),
    queryFn: receiptDealLogQueryFn,
    keepPreviousData: true,
    refetchInterval: 2500
  });

  const prefetch = useMemoizedFn((newPage: number) => {
    const [dealId] = args;
    const queryKey = getDealDetailLogQueryKey(dealId, newPage);
    queryClient.prefetchQuery(queryKey, receiptDealLogQueryFn);
  });

  return { data, prefetch };
};
