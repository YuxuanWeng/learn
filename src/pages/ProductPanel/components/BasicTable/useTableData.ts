import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useAtom, useAtomValue } from 'jotai';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_CUSTOM_SORTING_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import {
  BondQuoteQueryFilterParams,
  DynamicFilterParams,
  getBondQuoteDynamicFilterParams,
  getBondQuoteQueryFn,
  getBondQuoteQueryKey,
  useBondQuoteQuery
} from '@/common/services/hooks/useBondQuoteQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  basicTablePageAtom,
  basicTableQuoteFilterValueAtom,
  basicTableSorterAtom,
  referredTablePageAtom,
  referredTableQuoteFilterValueAtom,
  referredTableSorterAtom
} from '@/pages/ProductPanel/atoms/table';
import { useGlobalSearchValue } from '../../atoms/global-search';
import { useMainGroupData } from '../../providers/MainGroupProvider';

const prefetchQueryFn = getBondQuoteQueryFn();

export const useBasicTableData = (referred?: boolean, active?: boolean) => {
  const queryClient = useQueryClient();
  const { productType } = useProductParams();
  const searchValue = useGlobalSearchValue();
  const { delayedActiveGroupState, activeGroupState, advanceGroupStructs } = useMainGroupData();

  const {
    quickFilter: quickFilterValue = DEFAULT_QUICK_FILTER_VALUE,
    generalFilter: generalFilterValue = DEFAULT_GENERAL_FILTER_VALUE,
    bondIssueInfoFilter: bondIssueInfoFilterValue = DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
    customSorting: customSortingValue = DEFAULT_CUSTOM_SORTING_VALUE
  } = delayedActiveGroupState ?? {};

  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

  const relatedFilter = useAtomValue(
    useMemo(() => (referred ? referredTableQuoteFilterValueAtom : basicTableQuoteFilterValueAtom), [referred])
  );
  const relatedFilterValue = useMemo(() => {
    const { is_my_flag = false, ...otherFilterValues } = relatedFilter ?? {};

    return {
      ...otherFilterValues,
      broker_id_list: is_my_flag ? currProductTypeTeamBrokerIdList : []
    };
  }, [relatedFilter, currProductTypeTeamBrokerIdList]);

  const [page, setPage] = useAtom(useMemo(() => (referred ? referredTablePageAtom : basicTablePageAtom), [referred]));
  const sorter = useAtomValue(useMemo(() => (referred ? referredTableSorterAtom : basicTableSorterAtom), [referred]));

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getBondQuoteDynamicFilterParams({
        productType,
        quickFilterValue,
        customSortingValue,
        generalFilterValue,
        bondIssueInfoFilterValue,
        relatedFilterValue,
        // TODO 第一版不要求
        extraKeyMarketList: [],
        searchValue,
        sorter,
        page,
        referred,
        activeGroup: activeGroupState.activeGroup,
        advanceGroupStructs
      }),
    [
      productType,
      quickFilterValue,
      customSortingValue,
      generalFilterValue,
      bondIssueInfoFilterValue,
      relatedFilterValue,
      searchValue,
      sorter,
      page,
      referred,
      activeGroupState.activeGroup,
      advanceGroupStructs
    ]
  );

  const query = useBondQuoteQuery({
    productType,
    referred: referred ?? false,
    filterParams,
    enabled: !!delayedActiveGroupState,
    requestConfig: { interval: active ? 500 : Infinity },
    loggerEnabled: active,
    onOptimisticDeleteAll({ data }) {
      // 作废区不需要这个处理
      if (referred) return;
      const pageSize = getPollingAPIPageCount();
      // 如果为从列表移除的乐观更新，并且移除的目标数与单页总数一致，并且为最后一页
      if (page === Math.ceil((data?.total ?? 0) / pageSize)) {
        setPage(prev => {
          // 如果 prev 为第 1 页
          if (prev >= 1) return prev;
          return 1;
        });
      }
    }
  });

  const prefetch = useMemoizedFn((params: Partial<BondQuoteQueryFilterParams>) => {
    const fetchParams = getBondQuoteDynamicFilterParams({
      productType,
      quickFilterValue,
      customSortingValue,
      generalFilterValue,
      bondIssueInfoFilterValue,
      relatedFilterValue,
      // TODO 第一版不要求
      extraKeyMarketList: [],
      searchValue,
      sorter,
      page,
      referred,
      activeGroup: activeGroupState.activeGroup,
      advanceGroupStructs,
      ...params
    });
    const key = getBondQuoteQueryKey(productType, referred, fetchParams);
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  });

  return { prefetch, ...query };
};
