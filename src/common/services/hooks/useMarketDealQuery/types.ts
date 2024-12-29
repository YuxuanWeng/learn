import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import { ProductType } from '@fepkg/services/types/enum';
import type { MarketDealSearch } from '@fepkg/services/types/market-deal/search';
import { UseQueryResult } from '@tanstack/react-query';
import { DealTableColumn } from '@/pages/ProductPanel/components/DealTable/types';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams = Omit<MarketDealSearch.Request, 'product_type'>;

/** MarketDealSearch 接口返回并转换后的数据 */
export type MarketDealFetchData = {
  list?: DealTableColumn[];
  total?: number;
};

export type UseMarketDealQueryParams = {
  /** 台子类型 */
  productType: ProductType;
  /** 动态筛选参数 */
  filterParams: DynamicFilterParams;
  /** request 配置项 */
  requestConfig: UseDataQueryRequestConfig;
  /** 是否启用 logger */
  loggerEnabled?: boolean;
};

export type UseMarketDealQueryResult = UseQueryResult<MarketDealFetchData> & {
  /** Query refetch */
  handleRefetch: () => void;
};

export type UseMarketDealQuery = (params: UseMarketDealQueryParams) => UseMarketDealQueryResult;
