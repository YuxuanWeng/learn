import type { BondOptimalQuoteSearch } from '@fepkg/services/types/bond-optimal-quote/search';
import { UseQueryResult } from '@tanstack/react-query';
import { OptimalTableColumn } from '@/pages/ProductPanel/components/OptimalTable/types';
import { OptimisticUpdateParams, UseBondQuoteQueryParams } from '../useBondQuoteQuery';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams = Omit<BondOptimalQuoteSearch.Request, 'product_type'>;

/** BondOptimalQuoteSearch 接口返回并转换后的数据 */
export type BondOptimalQuoteFetchData = {
  list?: OptimalTableColumn[];
  total?: number;
};

export type UseBondOptimalQuoteQueryParams = Omit<UseBondQuoteQueryParams<BondOptimalQuoteFetchData>, 'referred'>;

export type UseBondOptimalQuoteQueryResult = UseQueryResult<BondOptimalQuoteFetchData> & {
  /** Query refetch */
  handleRefetch: () => void;
  /** 乐观更新 */
  optimisticUpdate: (params: OptimisticUpdateParams) => void;
};

export type UseBondOptimalQuoteQuery = (params: UseBondOptimalQuoteQueryParams) => UseBondOptimalQuoteQueryResult;
