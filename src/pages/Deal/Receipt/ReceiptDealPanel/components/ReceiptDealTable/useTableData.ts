import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell';
import { UserAccessGrantType } from '@fepkg/services/types/bds-enum';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue } from 'jotai';
import {
  DynamicFilterParams,
  ReceiptDealQueryFilterParams,
  getReceiptDealDynamicFilterParams,
  getReceiptDealQueryFn,
  getReceiptDealQueryKey,
  useReceiptDealQuery
} from '@/common/services/hooks/useReceiptDealQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { useAccessGrant } from '@/pages/Base/SystemSetting/components/TradeSettings/useAccessGrant';
import {
  receiptDealTableDealInputFilterValueAtom,
  receiptDealTableDealRelatedFilterValueAtom,
  receiptDealTablePageAtom,
  receiptDealTableSorterAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { useGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { useReceiptDealPanelLoader } from '../../providers/ReceiptDealPanelProvider/preload';

export const useReceiptDealTableData = (active: boolean) => {
  const { productType } = useProductParams();
  const { isOnOrBeforeFirstWorkdayOfMonth } = useReceiptDealPanelLoader();

  const queryClient = useQueryClient();
  const searchValue = useGlobalSearchValue();

  const defaultGrantUserIdList = [miscStorage?.userInfo?.user_id ?? ''];
  const { grantUserIdList = defaultGrantUserIdList } = useAccessGrant(
    UserAccessGrantType.UserAccessGrantTypeReceiptDeal
  );

  const relatedFilterValue = useAtomValue(receiptDealTableDealRelatedFilterValueAtom);
  const inputFilter = useAtomValue(receiptDealTableDealInputFilterValueAtom);
  const page = useAtomValue(receiptDealTablePageAtom);
  const sorter = useAtomValue(receiptDealTableSorterAtom);

  const prefetchQueryFn = useMemoizedFn(getReceiptDealQueryFn({ grantUserIdList, isOnOrBeforeFirstWorkdayOfMonth }));

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getReceiptDealDynamicFilterParams({
        relatedFilterValue,
        inputFilter,
        searchValue,
        sorter,
        page
      }),
    [relatedFilterValue, inputFilter, searchValue, sorter, page]
  );

  const prefetch = (params: Partial<ReceiptDealQueryFilterParams>) => {
    const key = getReceiptDealQueryKey(
      productType,
      getReceiptDealDynamicFilterParams({
        relatedFilterValue,
        inputFilter,
        searchValue,
        sorter,
        page,
        ...params
      })
    );
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  };

  return {
    prefetch,
    ...useReceiptDealQuery({
      productType,
      filterParams,
      requestConfig: { interval: active ? 500 : Infinity },
      loggerEnabled: active,
      grantUserIdList
    })
  };
};
