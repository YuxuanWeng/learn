import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { noNil } from '@fepkg/common/utils';
import { TableSorter } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InputFilter } from '@fepkg/services/types/common';
import { DealDateType, ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { QueryFunction } from '@tanstack/react-query';
import { cloneDeep } from 'lodash-es';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { DEFAULT_QUOTE_FILTER_VALUE, DEFAULT_TIME_RANGE_VALUE } from '@/common/constants/filter';
import { fetchMarketDeal } from '@/common/services/api/market-deal/search';
import { FilterGroupsStruct } from '@/common/services/hooks/useAdvanceGroupQuery';
import { transform2PrevWorkingDate } from '@/common/services/hooks/usePrevWorkingDate';
import {
  getExtraKeyMarketList,
  getInputFilter,
  getSorterMethod,
  getSorterMethodList,
  handleGeneralFilterValue
} from '@/common/utils/quote';
import { CustomSortFieldOptions } from '@/components/BondFilter/CustomSorting/types';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue, QuoteFilterValue } from '@/components/BondFilter/types';
import { miscStorage } from '@/localdb/miscStorage';
import { GroupStruct } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { deleteFalsyValue, deleteInvalidQuickFilterValues } from '@/pages/ProductPanel/utils';
import { DynamicFilterParams, MarketDealFetchData } from './types';

export const getMarketDealQueryKey = (productType: ProductType, filterParams?: DynamicFilterParams) => {
  const queryKey: unknown[] = [APIs.marketDeal.search];

  if (productType != undefined) queryKey.push(productType);
  if (filterParams != undefined) queryKey.push({ ...filterParams });

  return queryKey as [string, ProductType, DynamicFilterParams | undefined];
};

export const getMarketDealQueryFn =
  (requestConfig?: RequestConfig): QueryFunction<MarketDealFetchData, ReturnType<typeof getMarketDealQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, productType, filterParams] = queryKey;
    const fetchParams = { product_type: productType, ...filterParams! };
    return fetchMarketDeal({ params: fetchParams, requestConfig: { ...requestConfig, signal } });
  };

export type MarketDealQueryFilterParams = {
  productType: ProductType;
  quickFilterValue: QuickFilterValue;
  customSortingValue: CustomSortFieldOptions;
  generalFilterValue: GeneralFilterValue;
  bondIssueInfoFilterValue: BondIssueInfoFilterValue;
  relatedFilterValue?: QuoteFilterValue;
  extraKeyMarketList: string[];
  followedBrokerIdList: string[];
  searchValue?: InputFilter;
  sorter?: TableSorter<QuoteSortedField>;
  page?: number;
  activeGroup?: GroupStruct;
  advanceGroupStructs?: FilterGroupsStruct[];
};

export const getMarketDealDynamicFilterParams = ({
  productType,
  quickFilterValue,
  customSortingValue,
  generalFilterValue,
  bondIssueInfoFilterValue,
  relatedFilterValue = DEFAULT_QUOTE_FILTER_VALUE,
  extraKeyMarketList,
  followedBrokerIdList,
  searchValue,
  sorter,
  page = 1,
  activeGroup,
  advanceGroupStructs
}: MarketDealQueryFilterParams): DynamicFilterParams => {
  const softLifecycleId = miscStorage?.softLifecycleId;
  const count = getPollingAPIPageCount();
  const lifeCycleTableRelatedFilter = cloneDeep(relatedFilterValue);
  // 市场成交表格中的筛选时间类型与时间都是生命周期维度的，因此当生命周期不匹配时各自取默认值作为接口入参
  if (lifeCycleTableRelatedFilter) {
    if (relatedFilterValue?.time_soft_lifecycleId != softLifecycleId) {
      lifeCycleTableRelatedFilter.date_range = DEFAULT_TIME_RANGE_VALUE;
    }
    if (relatedFilterValue?.date_type_soft_lifecycleId != softLifecycleId) {
      lifeCycleTableRelatedFilter.date_type = DealDateType.DealTime;
    }
  }
  if (!lifeCycleTableRelatedFilter?.date_range) {
    const weekdayList = dealDateManager.getDealDateRange();
    const prev11WorkingDate = transform2PrevWorkingDate(11, weekdayList);
    // 兜底查询前11个工作日
    lifeCycleTableRelatedFilter.date_range = {
      start_time: prev11WorkingDate.startOf('days').valueOf().toString()
    };
  }

  const commonFilters = {
    table_related_filter:
      noNil(
        { ...deleteFalsyValue(lifeCycleTableRelatedFilter, ['flag_internal', 'nothing_done']) },
        { keepFalse: true }
      ) ?? {},
    input_filter: getInputFilter(searchValue),
    sorting_method_list: getSorterMethodList('Market', quickFilterValue.custom_sorting, customSortingValue),
    sorting_method: getSorterMethod(sorter),
    extra_key_market_list: getExtraKeyMarketList(extraKeyMarketList),
    followed_broker_id_list: followedBrokerIdList,
    offset: (page - 1) * count,
    count
  };

  // 高级筛选模式
  if (activeGroup?.isAdvanceMode) {
    const defaultQuickFilter = {
      intelligence_sorting: false
    };
    const advanceOuterQuickFilter: QuickFilterValue = activeGroup.advanceOuterQuickFilter ?? defaultQuickFilter;
    const groupFilterList = advanceGroupStructs?.map(g => {
      return {
        quick_filter: g.quicklyFilterValue
          ? noNil<QuickFilterValue>(
              deleteInvalidQuickFilterValues({ ...deleteFalsyValue(g.quicklyFilterValue), ...defaultQuickFilter }),
              {
                keepFalse: true
              }
            ) ?? defaultQuickFilter
          : defaultQuickFilter,
        general_filter: g.generalFilterValue
          ? handleGeneralFilterValue(productType, g.generalFilterValue, g.bondIssueInfoFilterValue)
          : void 0
      };
    });
    return {
      ...commonFilters,
      quick_filter: noNil<QuickFilterValue>(
        deleteInvalidQuickFilterValues(deleteFalsyValue(advanceOuterQuickFilter, ['intelligence_sorting'])),
        { keepFalse: true }
      ) ?? {
        intelligence_sorting: advanceOuterQuickFilter.intelligence_sorting
      },
      general_filter: {},
      group_filter_list: groupFilterList,
      sorting_method_list: getSorterMethodList(
        'Market',
        advanceOuterQuickFilter.custom_sorting,
        activeGroup.customSorting
      )
    };
  }
  // 普通筛选模式
  return {
    ...commonFilters,
    quick_filter: noNil<QuickFilterValue>(
      deleteInvalidQuickFilterValues(deleteFalsyValue(quickFilterValue, ['intelligence_sorting'])),
      { keepFalse: true }
    ) ?? {
      intelligence_sorting: quickFilterValue.intelligence_sorting
    },
    general_filter: handleGeneralFilterValue(productType, generalFilterValue, bondIssueInfoFilterValue)
  };
};
