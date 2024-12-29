import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue } from 'jotai';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import {
  DynamicFilterParams,
  NCDPInfoQueryFilterParams,
  getNCDPInfoDynamicFilterParams,
  getNCDPInfoQueryFn,
  getNCDPInfoQueryKey,
  useNCDPInfoQuery
} from '@/common/services/hooks/useNCDPInfoQuery';
import { miscStorage } from '@/localdb/miscStorage';
import { useGlobalSearchValue } from '../../atoms/global-search';
import {
  basicTablePageAtom,
  basicTableQuoteFilterValueAtom,
  basicTableSorterAtom,
  referredTablePageAtom,
  referredTableQuoteFilterValueAtom,
  referredTableSorterAtom
} from '../../atoms/table';
import { useMainGroupData } from '../../providers/MainGroupProvider';

const prefetchQueryFn = getNCDPInfoQueryFn();

const productType = ProductType.NCDP;

export const useNCDPTableData = (referred?: boolean, active?: boolean) => {
  const queryClient = useQueryClient();
  const searchValue = useGlobalSearchValue();

  const { delayedActiveGroupState } = useMainGroupData();

  const {
    quickFilter: quickFilterValue = DEFAULT_QUICK_FILTER_VALUE,
    generalFilter: generalFilterValue = DEFAULT_GENERAL_FILTER_VALUE,
    bondIssueInfoFilter: bondIssueInfoFilterValue = DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE
  } = delayedActiveGroupState ?? {};

  const relatedFilter = useAtomValue(
    useMemo(() => (referred ? referredTableQuoteFilterValueAtom : basicTableQuoteFilterValueAtom), [referred])
  );
  const relatedFilterValue = useMemo(() => {
    const { is_my_flag = false, ...otherFilterValues } = relatedFilter ?? {};
    return {
      ...otherFilterValues,
      broker_id_list: is_my_flag && miscStorage?.userInfo?.user_id ? [miscStorage.userInfo.user_id] : undefined
    };
  }, [relatedFilter]);

  const page = useAtomValue(useMemo(() => (referred ? referredTablePageAtom : basicTablePageAtom), [referred]));
  const sorter = useAtomValue(useMemo(() => (referred ? referredTableSorterAtom : basicTableSorterAtom), [referred]));

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getNCDPInfoDynamicFilterParams({
        productType,
        quickFilterValue,
        generalFilterValue,
        bondIssueInfoFilterValue,
        relatedFilterValue,
        searchValue,
        sorter,
        page
      }),
    [
      bondIssueInfoFilterValue,
      generalFilterValue,
      page,
      productType,
      quickFilterValue,
      relatedFilterValue,
      searchValue,
      sorter
    ]
  );

  const query = useNCDPInfoQuery({
    productType,
    referred: referred ?? false,
    filterParams,
    enabled: !!delayedActiveGroupState,
    requestConfig: { interval: active ? 500 : Infinity },
    loggerEnabled: active
  });

  const prefetch = useMemoizedFn((params: Partial<NCDPInfoQueryFilterParams>) => {
    const fetchParams = getNCDPInfoDynamicFilterParams({
      productType,
      quickFilterValue,
      generalFilterValue,
      bondIssueInfoFilterValue,
      relatedFilterValue,
      searchValue,
      sorter,
      page,
      ...params
    });
    const key = getNCDPInfoQueryKey(productType, referred, fetchParams);
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  });

  return { prefetch, ...query };
};
