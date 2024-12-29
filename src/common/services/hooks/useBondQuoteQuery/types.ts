import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import type { BondQuoteSearch } from '@fepkg/services/types/bond-quote/search';
import { QuoteUpdate } from '@fepkg/services/types/common';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { UseQueryResult } from '@tanstack/react-query';
import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams = Omit<BondQuoteSearch.Request, 'product_type' | 'is_referred'>;

/** BondQuoteSearch 接口返回并转换后的数据 */
export type BondQuoteFetchData = {
  list?: BasicTableColumn[];
  total?: number;
};

/** 乐观更新操作的枚举类型 */
export enum OptimisticUpdateAction {
  Delete = 'delete',
  Modify = 'modify'
}

/** 乐观更新操作入参类型 */
export type OptimisticUpdateParams = {
  /** 操作类型 */
  action: OptimisticUpdateAction;
  /** 目标数组 */
  targets?: (string | QuoteUpdate)[];
  /** 已选择的方向（在最优报价处会传入） */
  selectedSide?: Side;
};

export type UseBondQuoteQueryParams<Data> = {
  /** 台子类型 */
  productType: ProductType;
  /** 是否为作废区 */
  referred: boolean;
  /** 动态筛选参数 */
  filterParams: DynamicFilterParams;
  /** request 配置项 */
  requestConfig: UseDataQueryRequestConfig;
  /** 是否启用 logger */
  loggerEnabled?: boolean;
  /** 乐观更新删除当页所有数据时的回调 */
  onOptimisticDeleteAll?: (params: OptimisticUpdateParams & { data?: Data }) => void;
  /** 是否允许发出请求 */
  enabled?: boolean;
};

export type UseBondQuoteQueryResult = UseQueryResult<BondQuoteFetchData> & {
  /** Query refetch */
  handleRefetch: () => void;
  /** 乐观更新 */
  optimisticUpdate: (params: OptimisticUpdateParams) => void;
};

export type UseBondQuoteQuery = (params: UseBondQuoteQueryParams<BondQuoteFetchData>) => UseBondQuoteQueryResult;
