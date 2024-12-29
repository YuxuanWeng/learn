import { APIs } from '@fepkg/services/apis';
import { ReceiptDealApprovalGetProcess } from '@fepkg/services/types/receipt-deal/approval-get-process';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { getReceiptDealProcess } from '@/common/services/api/approval/process-get';

const DEFAULT_STALE_TIME = 5000;

export const useReceiptDealProcess = (receipt_deal_id?: string) => {
  const queryFn: QueryFunction<ReceiptDealApprovalGetProcess.Response | undefined> = async ({ signal }) => {
    if (!receipt_deal_id) return undefined;
    return getReceiptDealProcess({ receipt_deal_id }, { signal });
  };

  return useQuery<ReceiptDealApprovalGetProcess.Response | undefined>({
    queryKey: [APIs.receiptDealApproval.processGet, receipt_deal_id] as const,
    queryFn,
    enabled: !!receipt_deal_id,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'refetch'],
    staleTime: DEFAULT_STALE_TIME,
    cacheTime: DEFAULT_STALE_TIME
  });
};
