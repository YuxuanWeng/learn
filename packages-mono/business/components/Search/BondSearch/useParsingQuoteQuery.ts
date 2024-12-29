import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { QuoteParsing, Trader } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { ParsingQuoteInfo } from '@fepkg/services/types/parsing/quote-info';
import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';

export type UseParsingQuoteQueryResponse = {
  quote_list: QuoteParsing[];
  trader_list: Trader[];
};

export type UseParsingQuoteQueryParams = {
  productType?: ProductType;
  keyword: string;
  /** 是否自动加星 */
  autoStar?: boolean;
  requestFn: (params: ParsingQuoteInfo.Request, config?: RequestConfig) => Promise<ParsingQuoteInfo.Response>;
  requestConfig?: RequestConfig;
  queryOptions?: Omit<UseQueryOptions<UseParsingQuoteQueryResponse>, 'queryKey' | 'queryFn'>;
  onQuery?: (params?: string) => void;
};

export const useParsingQuoteQuery = ({
  productType,
  keyword,
  autoStar,
  requestFn,
  requestConfig,
  queryOptions,
  onQuery
}: UseParsingQuoteQueryParams) => {
  const queryKey: QueryKey = [APIs.parsing.quoteInfo, productType, keyword, autoStar];
  const queryFn: QueryFunction<UseParsingQuoteQueryResponse> = async ({ signal }) => {
    onQuery?.(keyword);

    const response = await requestFn({ product_type: productType, user_input: keyword }, { ...requestConfig, signal });

    return {
      quote_list:
        response.quote_list?.map(item => {
          if (!item?.flag_star && autoStar) return { ...item, flag_star: 1 };
          return item;
        }) ?? [],
      trader_list: response.trader_list ?? []
    };
  };

  return {
    ...useQuery({ queryKey, queryFn, staleTime: 60 * 1000, enabled: false, retry: false, ...queryOptions }),
    queryKey
  };
};
