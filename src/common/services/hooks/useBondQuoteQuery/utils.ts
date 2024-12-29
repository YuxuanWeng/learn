import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { noNil } from '@fepkg/common/utils';
import { TableSorter } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InputFilter } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { QueryFunction } from '@tanstack/react-query';
import { cloneDeep } from 'lodash-es';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { DEFAULT_QUOTE_FILTER_VALUE, DEFAULT_TIME_RANGE_VALUE } from '@/common/constants/filter';
import { fetchBondQuote } from '@/common/services/api/bond-quote/search';
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
import { BondQuoteFetchData, DynamicFilterParams } from './types';

export const getBondQuoteQueryKey = (
  productType: ProductType,
  referred = false,
  filterParams?: DynamicFilterParams,
  interval?: number,
  apiStr = APIs.bondQuote.search
) => {
  const queryKey: unknown[] = [apiStr];

  if (productType != undefined) queryKey.push(productType);
  if (referred != undefined) queryKey.push(referred);
  if (filterParams != undefined) queryKey.push({ ...filterParams });
  if (interval != undefined) queryKey.push(interval);

  return queryKey as [string, ProductType, boolean | undefined, DynamicFilterParams | undefined, number | undefined];
};

export const getBondQuoteQueryFn =
  (requestConfig?: RequestConfig): QueryFunction<BondQuoteFetchData, ReturnType<typeof getBondQuoteQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, productType, referred, filterParams] = queryKey;
    const fetchParams = { product_type: productType, is_referred: referred ?? false, ...filterParams! };
    return fetchBondQuote({ params: fetchParams, requestConfig: { ...requestConfig, signal } });
  };

export type BondQuoteQueryFilterParams = {
  productType: ProductType;
  quickFilterValue: QuickFilterValue;
  generalFilterValue: GeneralFilterValue;
  customSortingValue: CustomSortFieldOptions;
  bondIssueInfoFilterValue: BondIssueInfoFilterValue;
  relatedFilterValue?: QuoteFilterValue;
  extraKeyMarketList: string[];
  searchValue?: InputFilter;
  sorter?: TableSorter<QuoteSortedField>;
  page?: number;
  referred?: boolean;
  activeGroup?: GroupStruct;
  advanceGroupStructs?: FilterGroupsStruct[];
};

export const getBondQuoteDynamicFilterParams = ({
  productType,
  quickFilterValue,
  customSortingValue,
  generalFilterValue,
  bondIssueInfoFilterValue,
  relatedFilterValue = DEFAULT_QUOTE_FILTER_VALUE,
  extraKeyMarketList,
  searchValue,
  sorter,
  page = 1,
  referred = false,
  activeGroup,
  advanceGroupStructs
}: BondQuoteQueryFilterParams): DynamicFilterParams => {
  const softLifecycleId = miscStorage?.softLifecycleId;
  const count = getPollingAPIPageCount();
  const lifeCycleTableRelatedFilter = cloneDeep(relatedFilterValue);
  // 作废区表格中的筛选时间是生命周期维度的，因此当生命周期不匹配时要取默认值作为接口入参
  if (
    referred &&
    lifeCycleTableRelatedFilter &&
    lifeCycleTableRelatedFilter?.time_soft_lifecycleId != softLifecycleId
  ) {
    lifeCycleTableRelatedFilter.date_range = DEFAULT_TIME_RANGE_VALUE;
  } else if (referred && !lifeCycleTableRelatedFilter.date_range) {
    const weekdayList = dealDateManager.getDealDateRange();
    const prev5WorkingDate = transform2PrevWorkingDate(5, weekdayList);
    // 兜底查询前五个工作日
    lifeCycleTableRelatedFilter.date_range = {
      start_time: prev5WorkingDate.startOf('days').valueOf().toString()
    };
  }
  // 移除 date_type
  lifeCycleTableRelatedFilter.date_type = undefined;

  const commonFilters = {
    table_related_filter: noNil({ ...deleteFalsyValue(lifeCycleTableRelatedFilter) }, { keepFalse: true }) ?? {},
    input_filter: getInputFilter(searchValue),
    sorting_method: getSorterMethod(sorter),
    sorting_method_list: getSorterMethodList('Bond', quickFilterValue.custom_sorting, customSortingValue),
    extra_key_market_list: getExtraKeyMarketList(extraKeyMarketList),
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
        'Bond',
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
