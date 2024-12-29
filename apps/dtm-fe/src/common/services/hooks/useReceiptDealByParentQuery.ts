import { APIs } from '@fepkg/services/apis';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get_by_parent';

export const useReceiptDealByParentQuery = (parent_deal_id?: string, enable?: boolean) => {
  const queryFn: QueryFunction<ReceiptDeal[] | undefined> = async ({ signal }) => {
    if (!parent_deal_id) return undefined;
    const result = await fetchReceiptDealByParent({ parent_deal_ids: [parent_deal_id] }, { signal });
    return result.receipt_deal_info;
  };

  return useQuery<ReceiptDeal[] | undefined>({
    queryKey: [APIs.receiptDeal.getByParent, parent_deal_id] as const,
    queryFn,
    enabled: !!parent_deal_id && enable,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'refetch']
  });
};
