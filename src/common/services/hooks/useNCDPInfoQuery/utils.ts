import { noNil } from '@fepkg/common/utils';
import { TableSorter } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InputFilter } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { QueryFunction } from '@tanstack/react-query';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { DEFAULT_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import { getInputFilter, getSorterMethod, handleGeneralFilterValue } from '@/common/utils/quote';
import { QuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue, QuoteFilterValue } from '@/components/BondFilter/types';
import { deleteFalsyValue, deleteInvalidQuickFilterValues } from '@/pages/ProductPanel/utils';
import { fetchNCDPInfo } from '../../api/bond-quote/ncdp-search';
import { DynamicFilterParams, NCDPInfoFetchData } from './types';

export const getNCDPInfoQueryKey = (productType: ProductType, referred = false, filterParams?: DynamicFilterParams) => {
  const queryKey: unknown[] = [APIs.bondQuote.ncdp.search];

  if (productType != undefined) queryKey.push(productType);
  if (referred != undefined) queryKey.push(referred);
  if (filterParams != undefined) queryKey.push({ ...filterParams });

  return queryKey as [string, ProductType, boolean | undefined, DynamicFilterParams | undefined];
};

export const getNCDPInfoQueryFn =
  (requestConfig?: RequestConfig): QueryFunction<NCDPInfoFetchData, ReturnType<typeof getNCDPInfoQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, productType, referred, filterParams] = queryKey;
    const fetchParams = { product_type: productType, is_deleted: referred ?? false, ...filterParams! };
    return fetchNCDPInfo({ params: fetchParams, requestConfig: { ...requestConfig, signal } });
  };

export type NCDPInfoQueryFilterParams = {
  productType: ProductType;
  quickFilterValue: QuickFilterValue;
  generalFilterValue: GeneralFilterValue;
  bondIssueInfoFilterValue: BondIssueInfoFilterValue;
  relatedFilterValue?: QuoteFilterValue;
  searchValue?: InputFilter;
  sorter?: TableSorter<QuoteSortedField>;
  page?: number;
};

export const getNCDPInfoDynamicFilterParams = ({
  productType,
  quickFilterValue,
  generalFilterValue,
  bondIssueInfoFilterValue,
  relatedFilterValue = DEFAULT_QUOTE_FILTER_VALUE,
  searchValue,
  sorter,
  page = 1
}: NCDPInfoQueryFilterParams): DynamicFilterParams => {
  const count = getPollingAPIPageCount();

  return {
    quick_filter: noNil<QuickFilterValue>(
      deleteInvalidQuickFilterValues(deleteFalsyValue(quickFilterValue, ['intelligence_sorting'])),
      { keepFalse: true }
    ) ?? {
      intelligence_sorting: quickFilterValue.intelligence_sorting
    },
    general_filter: handleGeneralFilterValue(productType, generalFilterValue, bondIssueInfoFilterValue),
    table_related_filter: {
      ...noNil(relatedFilterValue),
      date_type: undefined,
      flag_full: relatedFilterValue?.flag_full,
      flag_internal: relatedFilterValue?.flag_internal
    },
    input_filter: getInputFilter(searchValue),
    sorting_method: getSorterMethod(sorter),
    offset: (page - 1) * count,
    count
  };
};
