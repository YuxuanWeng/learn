import type {
  BaseResponse,
  BondOptimalQuote,
  GeneralFilter,
  InputFilter,
  QuickFilter,
  SortingMethod,
  TableRelatedFilter
} from '../common';
import { CompleteQuoteGroup, ProductType } from '../enum';

/**
 * @description 通过筛选条件获取针对利率债的完整报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_complete_quote/search
 */
export declare namespace BondCompleteQuoteSearch {
  type Request = {
    product_type: ProductType;
    quick_filter: QuickFilter;
    general_filter: GeneralFilter;
    table_related_filter: TableRelatedFilter;
    input_filter: InputFilter;
    sorting_method?: SortingMethod;
    extra_key_market_list?: string[]; // 额外需要关注的债券keyMarketList
    offset?: number;
    count?: number;
    lgb_key_market?: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    complete_quote_list?: BondCompleteQuote[];
    total: number;
    base_response?: BaseResponse;
    group_total?: GroupTotal[];
  };

  export type GroupTotal = {
    group: CompleteQuoteGroup;
    total: number;
  };

  export type BondCompleteQuote = {
    bond_optimal_quote: BondOptimalQuote;
    group: CompleteQuoteGroup;
  };
}
