import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealSearchV2 } from '@fepkg/services/types/receipt-deal/search-v2';
import { UseQueryResult } from '@tanstack/react-query';
import { ReceiptDealRowData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams = Omit<ReceiptDealSearchV2.Request, 'product_type'>;

/** MarketDealSearch 接口返回并转换后的数据 */
export type ReceiptDealFetchData = {
  list?: ReceiptDealRowData[];
  flatList?: ReceiptDeal[];
  originalParentList?: ReceiptDealSearchV2.ParentChildDeal[];
  total?: number;
  bridge_merge_total?: number;
};

export type UseReceiptDealQueryParams = {
  /** 台子类型 */
  productType: ProductType;
  /** 动态筛选参数 */
  filterParams: DynamicFilterParams;
  /** request 配置项 */
  requestConfig: UseDataQueryRequestConfig;
  /** 指定授权人id */
  grantUserIdList?: string[];
  /** 是否启用 logger */
  loggerEnabled?: boolean;
};

export type UseReceiptDealQueryResult = UseQueryResult<ReceiptDealFetchData> & {
  /** Query refetch */
  handleRefetch: () => Promise<void>;
};
