import { noNil } from '@fepkg/common/utils';
import { TableSorter } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InputFilter, LiquidationSpeed } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { QueryFunction } from '@tanstack/react-query';
import { DEFAULT_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import { fetchBondOptimalQuote } from '@/common/services/api/bond-optimal-quote/search';
import { FilterGroupsStruct } from '@/common/services/hooks/useAdvanceGroupQuery';
import {
  getExtraKeyMarketList,
  getInputFilter,
  getSorterMethod,
  getSorterMethodList,
  handleGeneralFilterValue
} from '@/common/utils/quote';
import { CustomSortFieldOptions } from '@/components/BondFilter/CustomSorting/types';
import { MIN_CONSIDERATION } from '@/components/BondFilter/QuickFilter';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue, QuoteFilterValue } from '@/components/BondFilter/types';
import { SettlementGroup } from '@/components/SettlementModal';
import { GroupStruct } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { deleteFalsyValue, deleteInvalidQuickFilterValues } from '@/pages/ProductPanel/utils';
import { BondOptimalQuoteFetchData, DynamicFilterParams } from './types';

export const getBondOptimalQuoteQueryKey = (productType: ProductType, filterParams?: DynamicFilterParams) => {
  const queryKey: unknown[] = [APIs.bondOptimalQuote.search];

  if (productType != undefined) queryKey.push(productType);
  if (filterParams != undefined) queryKey.push({ ...filterParams });

  return queryKey as [string, ProductType, DynamicFilterParams | undefined];
};

export const getBondOptimalQuoteQueryFn =
  (
    requestConfig?: RequestConfig
  ): QueryFunction<BondOptimalQuoteFetchData, ReturnType<typeof getBondOptimalQuoteQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, productType, filterParams] = queryKey;
    const fetchParams = { product_type: productType, ...filterParams! };
    return fetchBondOptimalQuote({
      params: fetchParams,
      brokerIdList: [],
      requestConfig: { ...requestConfig, signal }
    });
  };

export type BondOptimalQuoteQueryFilterParams = {
  productType: ProductType;
  unquoted?: boolean;
  quickFilterValue: QuickFilterValue;
  customSortingValue: CustomSortFieldOptions;
  generalFilterValue: GeneralFilterValue;
  bondIssueInfoFilterValue: BondIssueInfoFilterValue;
  relatedFilterValue?: QuoteFilterValue;
  extraKeyMarketList: string[];
  searchValue?: InputFilter;
  sorter?: TableSorter<QuoteSortedField>;
  page?: number;
  pageSize?: number;
  settlementGroupSettings?: SettlementGroup;
  activeGroup?: GroupStruct;
  advanceGroupStructs?: FilterGroupsStruct[];
};

export const getBondOptimalQuoteDynamicFilterParams = ({
  productType,
  unquoted,
  quickFilterValue,
  customSortingValue,
  generalFilterValue,
  bondIssueInfoFilterValue,
  relatedFilterValue = DEFAULT_QUOTE_FILTER_VALUE,
  extraKeyMarketList,
  searchValue,
  sorter,
  page = 1,
  pageSize = 60,
  settlementGroupSettings,
  activeGroup,
  advanceGroupStructs
}: BondOptimalQuoteQueryFilterParams): DynamicFilterParams => {
  const tableRelatedFilter = { ...relatedFilterValue };
  // 移除 date_type
  tableRelatedFilter.date_type = undefined;

  const commonFilters = {
    table_related_filter:
      noNil(
        {
          ...deleteFalsyValue(tableRelatedFilter, ['is_exercise']),
          liquidation_speed_list: (() => {
            let settlements: LiquidationSpeed[] = [];
            tableRelatedFilter.liquidation_speed_list?.forEach(v => {
              settlements = settlements.concat(
                settlementGroupSettings?.find(item => item.name === Number(v))?.value || []
              );
            });

            return settlements.filter(v => v.date || v.tag);
          })()
        },
        { keepFalse: true }
      ) ?? {},
    input_filter: getInputFilter(searchValue),
    sorting_method_list: getSorterMethodList('Optimal', quickFilterValue.custom_sorting, customSortingValue),
    sorting_method: getSorterMethod(sorter),
    extra_key_market_list: getExtraKeyMarketList(extraKeyMarketList),
    offset: (page - 1) * pageSize,
    count: pageSize
  };

  // 高级筛选模式
  if (activeGroup?.isAdvanceMode) {
    const defaultQuickFilter = {
      intelligence_sorting: false,
      unquoted
    };
    const advanceOuterQuickFilter: QuickFilterValue = activeGroup.advanceOuterQuickFilter ?? defaultQuickFilter;
    const groupFilterList = advanceGroupStructs?.map(g => {
      return {
        quick_filter: g.quicklyFilterValue
          ? noNil<QuickFilterValue>(
              deleteInvalidQuickFilterValues({
                ...deleteFalsyValue(g.quicklyFilterValue),
                ...defaultQuickFilter,
                unquoted,
                consideration:
                  quickFilterValue.consideration === MIN_CONSIDERATION ? undefined : quickFilterValue.consideration
              }),
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
        deleteInvalidQuickFilterValues({
          ...deleteFalsyValue(advanceOuterQuickFilter, ['intelligence_sorting']),
          unquoted,
          consideration:
            advanceOuterQuickFilter.consideration === MIN_CONSIDERATION ? undefined : quickFilterValue.consideration
        }),
        { keepFalse: true }
      ) ?? {
        intelligence_sorting: advanceOuterQuickFilter.intelligence_sorting
      },
      general_filter: {},
      group_filter_list: groupFilterList,
      sorting_method_list: getSorterMethodList(
        'Optimal',
        advanceOuterQuickFilter.custom_sorting,
        activeGroup.customSorting
      )
    };
  }
  // 普通筛选模式
  return {
    ...commonFilters,
    quick_filter: noNil<QuickFilterValue>(
      deleteInvalidQuickFilterValues({
        ...deleteFalsyValue(quickFilterValue, ['intelligence_sorting']),
        unquoted,
        consideration: quickFilterValue.consideration === MIN_CONSIDERATION ? undefined : quickFilterValue.consideration
      }),
      { keepFalse: true }
    ) ?? {
      intelligence_sorting: quickFilterValue.intelligence_sorting
    },
    general_filter: handleGeneralFilterValue(productType, generalFilterValue, bondIssueInfoFilterValue)
  };
};
