import { useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_CUSTOM_SORTING_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import {
  DynamicFilterParams,
  MarketDealQueryFilterParams,
  getMarketDealDynamicFilterParams,
  getMarketDealQueryFn,
  getMarketDealQueryKey,
  useMarketDealQuery
} from '@/common/services/hooks/useMarketDealQuery';
import { useProductParams } from '@/layouts/Home/hooks';
import { useGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import {
  dealTablePageAtom,
  dealTableQuoteFilterValueAtom,
  dealTableSorterAtom
} from '@/pages/ProductPanel/atoms/table';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';

const prefetchQueryFn = getMarketDealQueryFn();

export const useDealTableData = (active: boolean) => {
  const { productType } = useProductParams();

  const queryClient = useQueryClient();
  const searchValue = useGlobalSearchValue();
  const { delayedActiveGroupState, activeGroupState, advanceGroupStructs } = useMainGroupData();

  const {
    quickFilter: quickFilterValue = DEFAULT_QUICK_FILTER_VALUE,
    customSorting: customSortingValue = DEFAULT_CUSTOM_SORTING_VALUE,
    generalFilter: generalFilterValue = DEFAULT_GENERAL_FILTER_VALUE,
    bondIssueInfoFilter: bondIssueInfoFilterValue = DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE
  } = delayedActiveGroupState ?? {};

  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

  const relatedFilterValue = useAtomValue(dealTableQuoteFilterValueAtom);
  const page = useAtomValue(dealTablePageAtom);
  const sorter = useAtomValue(dealTableSorterAtom);

  const filterParams: DynamicFilterParams = useMemo(
    () =>
      getMarketDealDynamicFilterParams({
        productType,
        quickFilterValue,
        customSortingValue,
        generalFilterValue,
        bondIssueInfoFilterValue,
        relatedFilterValue,
        // TODO 第一版不要求
        extraKeyMarketList: [],
        followedBrokerIdList: currProductTypeTeamBrokerIdList,
        searchValue,
        sorter,
        page,
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
      currProductTypeTeamBrokerIdList,
      searchValue,
      sorter,
      page,
      activeGroupState.activeGroup,
      advanceGroupStructs
    ]
  );

  const prefetch = (params: Partial<MarketDealQueryFilterParams>) => {
    const key = getMarketDealQueryKey(
      productType,
      getMarketDealDynamicFilterParams({
        productType,
        quickFilterValue,
        customSortingValue,
        generalFilterValue,
        bondIssueInfoFilterValue,
        relatedFilterValue,
        // TODO 第一版不要求
        extraKeyMarketList: [],
        followedBrokerIdList: currProductTypeTeamBrokerIdList,
        searchValue,
        sorter,
        page,
        activeGroup: activeGroupState.activeGroup,
        advanceGroupStructs,
        ...params
      })
    );
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  };

  return {
    prefetch,
    ...useMarketDealQuery({
      productType,
      filterParams,
      requestConfig: { interval: active ? 500 : Infinity },
      loggerEnabled: active
    })
  };
};
