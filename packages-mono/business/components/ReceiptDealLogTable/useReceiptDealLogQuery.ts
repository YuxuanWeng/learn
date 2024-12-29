import { RequestConfig } from '@fepkg/request/types';
import { fetchReceiptDealOperationLog } from '@fepkg/services/api/receipt-deal/get-operation-log';
import { APIs } from '@fepkg/services/apis';
import { OperationSource } from '@fepkg/services/types/enum';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { RECEIPT_DEAL_LOG_TABLE_MAX_PAGE, RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE } from './constants';
import { ReceiptDealLogTableRowData } from './types';
import { transform2ReceiptDealLogTableRowData } from './utils';

/** fetchReceiptDealOperationLog 接口返回并转换后的数据 */
export type ReceiptDealOperationLogFetchData = {
  list: ReceiptDealLogTableRowData[];
  total: number;
};

export const getReceiptDealLogQueryKey = (dealId: string, source: OperationSource, page: number) => {
  return [APIs.receiptDeal.getOperationLog, dealId, source, page] as const;
};

export const getReceiptDealLogQueryFn =
  (
    requestConfig?: RequestConfig
  ): QueryFunction<ReceiptDealOperationLogFetchData, ReturnType<typeof getReceiptDealLogQueryKey>> =>
  async ({ signal, queryKey }) => {
    const [, dealId, source, page] = queryKey;

    // 超过 10 页后，只能请求第 10 页
    let offset = (page - 1) * RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE;
    if (page >= RECEIPT_DEAL_LOG_TABLE_MAX_PAGE) offset = RECEIPT_DEAL_LOG_TABLE_MAX_PAGE - 1;

    try {
      const res = await fetchReceiptDealOperationLog(
        {
          receipt_deal_id: dealId,
          source,
          offset,
          count: RECEIPT_DEAL_LOG_TABLE_PAGE_SIZE
        },
        { ...requestConfig, signal }
      );

      return { list: res?.log_list?.map(transform2ReceiptDealLogTableRowData) ?? [], total: res?.total };
    } catch {
      return { list: [], total: 0 };
    }
  };

const receiptDealLogQueryFn = getReceiptDealLogQueryFn();

export const useReceiptDealLogQuery = (...args: Parameters<typeof getReceiptDealLogQueryKey>) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: getReceiptDealLogQueryKey(...args),
    queryFn: receiptDealLogQueryFn,
    keepPreviousData: true
  });

  const prefetch = useMemoizedFn((newPage: number) => {
    const [dealId, source] = args;
    const queryKey = getReceiptDealLogQueryKey(dealId, source, newPage);
    queryClient.prefetchQuery(queryKey, receiptDealLogQueryFn);
  });

  return { data, prefetch };
};
