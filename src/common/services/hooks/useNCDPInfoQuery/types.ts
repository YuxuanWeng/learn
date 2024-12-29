import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import { BondQuoteNcdpSearch } from '@fepkg/services/types/bond-quote/ncdp-search';
import { ProductType } from '@fepkg/services/types/enum';
import { UseQueryResult } from '@tanstack/react-query';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams = Omit<BondQuoteNcdpSearch.Request, 'product_type' | 'is_deleted'>;

export type NCDPInfoFetchData = {
  list?: NCDPTableColumn[];
  total?: number;
};

export type UseNCDPInfoQueryParams = {
  /** 台子类型 */
  productType: ProductType;
  /** 是否为已删除 */
  referred: boolean;
  /** 动态筛选参数 */
  filterParams: DynamicFilterParams;
  /** request 配置项 */
  requestConfig: UseDataQueryRequestConfig;
  /** 是否启用 logger */
  loggerEnabled?: boolean;
  /** 是否允许发出请求 */
  enabled?: boolean;
};

export type UseNCDPInfoQueryResult = UseQueryResult<NCDPInfoFetchData> & {
  /** Query refetch */
  handleRefetch: () => void;
};

export type UseNCDPInfoQuery = (params: UseNCDPInfoQueryParams) => UseNCDPInfoQueryResult;
