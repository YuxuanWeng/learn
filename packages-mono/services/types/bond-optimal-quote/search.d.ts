import type {
  BaseResponse,
  BondOptimalQuote,
  GeneralFilter,
  GroupFilter,
  InputFilter,
  QuickFilter,
  SortingMethod,
  TableRelatedFilter
} from '../common';
import { ProductType } from '../enum';

/**
 * @description 通过筛选条件获取最优报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/search
 */
export declare namespace BondOptimalQuoteSearch {
  type Request = {
    product_type: ProductType;
    quick_filter: QuickFilter; // 废弃
    general_filter: GeneralFilter; // 废弃
    table_related_filter: TableRelatedFilter;
    input_filter: InputFilter;
    sorting_method?: SortingMethod;
    extra_key_market_list?: string[]; // 额外需要关注的债券keyMarketList
    offset: number;
    count: number;
    sorting_method_list?: SortingMethod[];
    group_filter_list?: GroupFilter[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    optimal_quote_list?: BondOptimalQuote[];
    total: number;
    base_response?: BaseResponse;
  };
}
