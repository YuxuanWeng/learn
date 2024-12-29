import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_CUSTOM_SORTING_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import {
  BondOptimalQuoteQueryFilterParams,
  DynamicFilterParams,
  getBondOptimalQuoteDynamicFilterParams,
  getBondOptimalQuoteQueryFn,
  getBondOptimalQuoteQueryKey,
  useBondOptimalQuoteQuery
} from '@/common/services/hooks/useBondOptimalQuoteQuery';
import { useProductSettlementGroupSettings } from '@/common/services/hooks/useSettings/useProductSettlementGroupSettings';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  bondTablePageAtom,
  bondTableQuoteFilterValueAtom,
  bondTableSorterAtom,
  optimalTablePageAtom,
  optimalTableQuoteFilterValueAtom,
  optimalTableSorterAtom
} from '@/pages/ProductPanel/atoms/table';
import { useGlobalSearchValue } from '../../atoms/global-search';
import { useMainGroupData } from '../../providers/MainGroupProvider';

const prefetchQueryFn = getBondOptimalQuoteQueryFn();

export const useOptimalTableData = (unquoted: boolean, pageSize: number, active?: boolean) => {
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

  const relatedFilter = useAtomValue(unquoted ? bondTableQuoteFilterValueAtom : optimalTableQuoteFilterValueAtom);
  const relatedFilterValue = useMemo(() => {
    const { is_my_flag = false, ...otherFilterValues } = relatedFilter ?? {};

    return {
      ...otherFilterValues,
      broker_id_list: is_my_flag ? currProductTypeTeamBrokerIdList : []
    };
  }, [relatedFilter, currProductTypeTeamBrokerIdList]);

  const [page, setPage] = useAtom(unquoted ? bondTablePageAtom : optimalTablePageAtom);
  const sorter = useAtomValue(unquoted ? bondTableSorterAtom : optimalTableSorterAtom);

  const { settlementGroupSettings } = useProductSettlementGroupSettings(productType);

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getBondOptimalQuoteDynamicFilterParams({
        productType,
        unquoted,
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
        pageSize,
        settlementGroupSettings,
        activeGroup: activeGroupState.activeGroup,
        advanceGroupStructs
      }),
    [
      productType,
      unquoted,
      quickFilterValue,
      customSortingValue,
      generalFilterValue,
      bondIssueInfoFilterValue,
      relatedFilterValue,
      searchValue,
      sorter,
      page,
      pageSize,
      settlementGroupSettings,
      activeGroupState.activeGroup,
      advanceGroupStructs
    ]
  );

  const prefetch = (params: Partial<BondOptimalQuoteQueryFilterParams>) => {
    const key = getBondOptimalQuoteQueryKey(
      productType,
      getBondOptimalQuoteDynamicFilterParams({
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
        pageSize,
        settlementGroupSettings,
        activeGroup: activeGroupState.activeGroup,
        advanceGroupStructs,
        ...params
      })
    );
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  };

  return {
    prefetch,
    ...useBondOptimalQuoteQuery({
      productType,
      filterParams,
      requestConfig: { interval: active ? 500 : Infinity },
      loggerEnabled: active,
      onOptimisticDeleteAll({ data }) {
        // 如果为从列表移除的乐观更新，并且移除的目标数与单页总数一致，并且为最后一页
        if (page === Math.ceil((data?.total ?? 0) / pageSize)) {
          setPage(prev => {
            // 如果 prev 为第 1 页
            if (prev === 1) return prev;
            return prev - 1;
          });
        }
      },
      enabled: !!delayedActiveGroupState
    })
  };
};
