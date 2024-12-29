import type {
  BaseResponse,
  GeneralFilter,
  GroupFilter,
  InputFilter,
  QuickFilter,
  QuoteLite,
  SortingMethod,
  TableRelatedFilter
} from '../common';
import { ProductType } from '../enum';

/**
 * @description 通过筛选条件获取报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/search
 */
export declare namespace BondQuoteSearch {
  type Request = {
    product_type: ProductType;
    quick_filter: QuickFilter;
    general_filter: GeneralFilter;
    table_related_filter: TableRelatedFilter;
    input_filter: InputFilter;
    is_referred: boolean; // 是否为作废区报价
    extra_key_market_list?: string[]; // 额外需要关注的债券keyMarketList
    sorting_method?: SortingMethod;
    offset: number;
    count: number;
    sorting_method_list?: SortingMethod[];
    group_filter_list?: GroupFilter[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    quote_list?: QuoteLite[];
    total: number;
    base_response?: BaseResponse;
  };
}
