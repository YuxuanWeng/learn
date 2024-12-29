import { APIs } from '@fepkg/services/apis';
import type { ReceiptDealDetailSearchByBridgeInst } from '@fepkg/services/types/receipt-deal/detail-search-by-bridge-inst';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { fetchReceiptDealDetailSearchByBridgeInst } from '@/common/services/api/bridge/deal-detail-search-by-bridge-inst';

const INTERVAL = 1500;

/**
 * 整个页面的数据
 */
export const useBridgeReceiptDeals = (params: ReceiptDealDetailSearchByBridgeInst.Request) => {
  const queryKey = [APIs.receiptDeal.dealDetailSearchByInst, params] as [
    string,
    ReceiptDealDetailSearchByBridgeInst.Request
  ];
  const queryFn: QueryFunction<ReceiptDealDetailSearchByBridgeInst.Response> = () =>
    fetchReceiptDealDetailSearchByBridgeInst(params);
  const query = useQuery<ReceiptDealDetailSearchByBridgeInst.Response, unknown>({
    queryKey,
    queryFn,
    staleTime: INTERVAL,
    refetchInterval: INTERVAL,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    keepPreviousData: false
  });

  return query;
};
