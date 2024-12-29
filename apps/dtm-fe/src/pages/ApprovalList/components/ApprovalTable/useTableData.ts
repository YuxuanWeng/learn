import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell';
import { useAuth } from '@/providers/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn, usePrevious } from 'ahooks';
import { useAtom, useAtomValue } from 'jotai';
import { isEqual } from 'lodash-es';
import { useFlagSearchChild } from '@/common/atoms';
import {
  CheckUpdateResult,
  DynamicFilterParams,
  ReceiptDealApprovalQueryFilterParams,
  getReceiptDealApprovalDynamicFilterParams,
  getReceiptDealApprovalQueryFn,
  getReceiptDealApprovalQueryKey,
  useReceiptDealApprovalQuery
} from '@/common/services/hooks/useReceiptDealApprovalSearch';
import { useHistoryCheckUpdate } from '@/common/services/hooks/useReceiptDealApprovalSearch/useHistoryCheckUpdate';
import {
  approvalListInputFilterValueAtom,
  approvalListPageAtom,
  approvalListPageSizeAtom,
  approvalListTableNeedUpdate,
  approvalListTableSorterAtom
} from '@/pages/ApprovalList/atoms';
import { ApprovalListRelatedFilter, ApprovalListType } from '@/pages/ApprovalList/types';

export const useReceiptDealApprovalTableData = (
  type: ApprovalListType,
  relatedFilterValue: ApprovalListRelatedFilter,
  active: boolean
) => {
  const { user, productTypeList } = useAuth();
  const queryClient = useQueryClient();
  const inputFilter = useAtomValue(approvalListInputFilterValueAtom);
  const page = useAtomValue(approvalListPageAtom);
  const pageSize = useAtomValue(approvalListPageSizeAtom);
  const flagSearchChild = useFlagSearchChild();
  const [needUpdate, setNeedUpdate] = useAtom(approvalListTableNeedUpdate);
  const sorter = useAtomValue(approvalListTableSorterAtom);

  const searchChild = type === ApprovalListType.Deal ? true : flagSearchChild;

  const prefetchQueryFn = getReceiptDealApprovalQueryFn(undefined, user?.user_id);

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getReceiptDealApprovalDynamicFilterParams(
        {
          relatedFilterValue,
          inputFilter,
          sorter,
          page,
          pageSize,
          type
        },
        productTypeList,
        searchChild
      ),
    [relatedFilterValue, inputFilter, sorter, page, pageSize, type, productTypeList, searchChild]
  );

  const prevFilterParams = usePrevious(filterParams);
  const isFilterParamsChanged = useMemo(
    () => !isEqual(filterParams, prevFilterParams),
    [filterParams, prevFilterParams]
  );

  const prefetch = (params: Partial<ReceiptDealApprovalQueryFilterParams>) => {
    const key = getReceiptDealApprovalQueryKey(
      getReceiptDealApprovalDynamicFilterParams(
        {
          relatedFilterValue,
          inputFilter,
          sorter,
          page,
          pageSize,
          type,
          ...params
        },
        productTypeList,
        searchChild
      ),
      type
    );
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  };

  const searchQuery = useReceiptDealApprovalQuery({
    filterParams,
    isFilterParamsChanged,
    requestConfig: { interval: active ? 500 : Infinity },
    loggerEnabled: active,
    type
  });

  const checkUpdateOnSuccess = useMemoizedFn((data: CheckUpdateResult) => {
    if (
      data?.need_update ||
      (searchQuery.data?.total !== undefined &&
        data?.filter_total !== undefined &&
        searchQuery.data.total !== data.filter_total)
    ) {
      setNeedUpdate(true);
    }
  });

  useHistoryCheckUpdate({
    filterParams,
    requestConfig: {},
    type,
    pause: searchQuery.isFetching || needUpdate,
    startTimestamp: searchQuery.data?.current_version ?? '',
    onSuccess: checkUpdateOnSuccess
  });

  return {
    prefetch,
    filterParams,
    ...searchQuery,
    needUpdate
  };
};
