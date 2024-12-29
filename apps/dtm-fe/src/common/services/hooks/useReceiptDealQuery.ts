import { fetchMulReceiptDeal } from '@fepkg/services/api/receipt-deal/mul-get-by-id';
import { APIs } from '@fepkg/services/apis';
import type { ReceiptDealMulGetById } from '@fepkg/services/types/receipt-deal/mul-get-by-id';
import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';

const REFETCH_INTERVAL = 500;

type ReceiptDealFetchData = ReceiptDealMulGetById.Response | undefined;

export const useReceiptDealQuery = (
  ids: string[],
  options?: Omit<UseQueryOptions<ReceiptDealFetchData>, 'queryKey' | 'queryFn' | 'initialData'> & {
    initialData?: ReceiptDealFetchData;
  }
) => {
  const queryFn: QueryFunction<ReceiptDealFetchData> = async ({ signal }) => {
    if (!ids.length) return undefined;
    return fetchMulReceiptDeal({ receipt_deal_id_list: ids }, { signal });
  };

  return useQuery<ReceiptDealFetchData, unknown, ReceiptDealFetchData>({
    queryKey: [APIs.receiptDeal.mulGetById, ids] as const,
    queryFn,
    enabled: !!ids?.length,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
    cacheTime: 0,
    ...options
  });
};
