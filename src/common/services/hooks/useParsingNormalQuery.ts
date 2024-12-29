import { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { BondSearchType, ProductType } from '@fepkg/services/types/enum';
import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { fetchBondSearch } from '../api/base-data/bond-search';

export type UseParsingNormalQueryParams = {
  productType: ProductType;
  keyword: string;
  requestConfig?: RequestConfig;
  queryOptions?: Omit<UseQueryOptions<RequestResponse<BaseDataBondSearch.Response>>, 'queryKey' | 'queryFn'>;
};

export const useParsingNormalQuery = ({
  productType,
  keyword,
  requestConfig,
  queryOptions
}: UseParsingNormalQueryParams) => {
  const queryKey = [APIs.baseData.bondSearch, productType, keyword] as const;
  const queryFn: QueryFunction<RequestResponse<BaseDataBondSearch.Response>> = ({ signal }) => {
    return fetchBondSearch(
      {
        product_type: productType,
        keyword,
        search_type: BondSearchType.SearchParsing
      },
      { ...requestConfig, signal }
    );
  };

  return {
    queryKey,
    ...useQuery<RequestResponse<BaseDataBondSearch.Response>>({
      queryKey,
      queryFn,
      staleTime: 60 * 1000,
      ...queryOptions
    })
  };
};
